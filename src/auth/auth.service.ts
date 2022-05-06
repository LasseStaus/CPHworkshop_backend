import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as argon from 'argon2'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto, SignupDto } from './dto'
import { hashConfig } from './helpers/hashconfig'
import { Tokens } from './types'

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signup(dto: SignupDto): Promise<Tokens> {
    const hash = await argon.hash(dto.password, { ...hashConfig })

    console.log('hej', hash)

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstname,
          lastName: dto.lastname,
          phonenumber: dto.phonenumber,
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
          throw new ForbiddenException('BE - Credentials taken hej')
        }
        console.log('BE log - Signup - Prisma Error', err)
      }
      console.log('BE log - Signup - Regular rerror', err)
    }
  }
  ////OLD

  async signin(dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    })

    if (!user) throw new ForbiddenException('BE - Credentials Incorret')

    const pwMatches = await argon.verify(user.hash, dto.password, {
      ...hashConfig
    })
    if (!pwMatches) throw new ForbiddenException('BE - credentials incorrect')

    const tokens = await this.signToken(user.id, user.email)
    await this.updateRtHash(user.id, tokens.refresh_token)

    delete user.hash

    return tokens
  }

  async logout(userId: number) {
    // delete refresh hash
    try {
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
      return { message: 'BE - Logout successfull' }
    } catch (err) {
      return { message: 'BE - Logout failed', error: err }
    }
  }
  async refreshTokens(userId: number, rt: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user || !user.hashedRt)
      throw new ForbiddenException('BE - Acces Denied - First')
    // check all exepections throws

    const rtMathces = await argon.verify(user.hashedRt, rt, { ...hashConfig })
    if (!rtMathces) throw new ForbiddenException('BE -Acces denied - second')

    const tokens = await this.signToken(user.id, user.email)
    await this.updateRtHash(user.id, tokens.refresh_token)

    return tokens
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await argon.hash(rt, { ...hashConfig })
    try {
      await this.prismaService.user.update({
        where: {
          id: userId
        },
        data: {
          hashedRt: hash
        }
      })
      return { message: 'BE - RT hash updated successfully' }
    } catch (err) {
      return { message: 'BE - RT hash update failed', error: err }
    }
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
