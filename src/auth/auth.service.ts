import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as argon from 'argon2'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto, SignupDto } from './dto'
import { hashConfig } from './helpers/hashconfig'
import { Tokens } from './types'

@Injectable() // enables dependency injections
export class AuthService {
  constructor(
    // dependency injections
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // #####################################

  async signup(
    dto: SignupDto
  ): Promise<{ message: string } | ForbiddenException | Error> {
    const hash = await argon.hash(dto.password, { ...hashConfig })

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          firstname: dto.firstname,
          lastname: dto.lastname,
          phonenumber: dto.phonenumber,
          isAdmin: false,
          hash
        }
      })

      await this.prismaService.ticket.create({
        data: {
          activeTickets: 0,
          usedTickets: 0,
          userId: user.id
        }
      })

      // create tokens
      const tokens = await this.signTokens(user.id, user.email)

      // update refresh token of user
      await this.updateRefreshTokenHash(user.id, tokens.refresh_token)

      return { message: 'You have been signed up successfully!' }
    } catch (err) {
      // if error comes from prisma or not
      if (err instanceof PrismaClientKnownRequestError) {
        // prisma error code for dublicate field
        if ((err.code = 'P2002')) {
          throw new ForbiddenException('Credentials taken')
        }
        throw new Error('Something went wrong, try agian later, Prisma')
      }
      throw new Error('Something went wrong, try agian later')
    }
  }

  // #####################################

  async signin(dto: LoginDto): Promise<{ tokens: Tokens; isAdmin: boolean }> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    })
    // check if user exists
    if (!user) throw new ForbiddenException('Credentials Incorret')

    // check if password matches
    const pwMatches = await argon.verify(user.hash, dto.password, {
      ...hashConfig
    })

    if (!pwMatches) throw new ForbiddenException('Credentials Incorrect')

    // create tokens
    const tokens = await this.signTokens(user.id, user.email)

    // update refresh token of user
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token)

    return { tokens: tokens, isAdmin: user.isAdmin }
  }

  // #####################################

  async logout(userId: string) {
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
    } catch (err) {
      throw new Error('Something went wrong, try agian later')
    }
  }

  // #####################################

  async refreshTokens(userId: string, rt: string) {
    // find user
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId
      }
    })

    // guard condition
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied')

    // compare hash of the refresh tokens
    const rtMathces = await argon.verify(user.hashedRt, rt, { ...hashConfig })
    if (!rtMathces)
      throw new ForbiddenException(
        'Access denied - refresh tokens does not match'
      )

    // generate new tokens
    const tokens = await this.signTokens(user.id, user.email)
    // update the refresh token hash
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token)

    return { tokens: tokens, isAdmin: user.isAdmin }
  }

  // #####################################

  async updateRefreshTokenHash(userId: string, rt: string) {
    const hash = await argon.hash(rt, { ...hashConfig }) // hash the refresh token

    // updates user with new refreshToken hash
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

  // #####################################

  async signTokens(
    // the data we want to sign
    userId: string,
    email: string
  ): Promise<Tokens> {
    // data object to sign
    const payload = {
      sub: userId,
      email: email
    }

    // secrets from .env file
    const atSecret = this.configService.get<string>('JWT_AT_SECRET')
    const rtSecret = this.configService.get<string>('JWT_RT_SECRET')

    // signing the tokens
    const [at, rt] = await Promise.all([
      // access token
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: atSecret
      }),

      // refresh token
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: rtSecret
      })
    ])

    return {
      access_token: at,
      refresh_token: rt
    }
  }
}
