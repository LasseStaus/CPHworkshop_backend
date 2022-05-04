import { ForbiddenException, HttpStatus, Injectable, Res } from '@nestjs/common'
import { User, Booking } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { domainToASCII } from 'url'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Tokens } from './types'
import { response, Response } from 'express'

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signup(dto: AuthDto): Promise<Tokens> {
    const hash = await argon.hash(dto.password)

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash
        }
      })

      const tokens = await this.signToken(user.id, user.email)
      await this.updateRtHash(user.id, tokens.refresh_token)

      delete user.hash
      return tokens
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if ((err.code = 'P2002')) {
          throw new ForbiddenException('Credentials taken hej')
        }
        console.log('Prisma Error', err)
      }
      console.log(err)
    }
  }
  ////OLD
  async signin(dto: AuthDto, res: Response) {
    console.log('BACKEDND')
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    })

    console.log('BACKEDND')
    console.log('BACKEDND')
    console.log(user)
    console.log(new Date())

    if (!user) throw new ForbiddenException('Credentials Incorret')

    const pwMatches = await argon.verify(user.hash, dto.password)
    if (!pwMatches) throw new ForbiddenException('credentials incorrect')

    const tokens = await this.signToken(user.id, user.email)
    await this.updateRtHash(user.id, tokens.refresh_token)

    //optional delete user.hash
    delete user.hash
    //  console.log(tokens)
    /* 
    res.cookie('jwt', tokens, {
      httpOnly: true,
      domain: 'http://localhost:3000'
    }) */
    // return res.status(200).send(tokens.access_token)
    const responseBody = {
      user: user,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token
    }
    const newObj = {
      id: user.id,
      email: user.email,
      token: tokens.access_token,
      refresh: tokens.refresh_token
    }
    console.log(tokens)

    return tokens
  }

  async logout(userId: number) {
    // delete refresh hash
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null
        }
      },
      data: {
        hashedRt: null
      }
    })
    return { henrik: 'henrik' }
  }
  async refreshTokens(userId: number, rt: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user || !user.hashedRt)
      throw new ForbiddenException('Acces Denied - First')
    // check all exepections throws

    const rtMathces = await argon.verify(user.hashedRt, rt)
    if (!rtMathces) throw new ForbiddenException('Acces denied - second')

    const tokens = await this.signToken(user.id, user.email)
    await this.updateRtHash(user.id, tokens.refresh_token)

    console.log('backend refresh tokens', tokens)
    return tokens
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await argon.hash(rt)
    await this.prismaService.user.update({
      where: {
        id: userId
      },
      data: {
        hashedRt: hash
      }
    })
  }

  async signToken(
    userId: number,
    email: string
  ): Promise<{
    access_token: string
    refresh_token: string
  }> {
    const payload = {
      sub: userId,
      email: email
    }
    const atSecret = this.configService.get('JWT_AT_SECRET')
    const rtSecret = this.configService.get('JWT_RT_SECRET')

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: atSecret
      }),

      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: rtSecret
      })
    ])

    return {
      access_token: at,
      refresh_token: rt
    }
  }
}
