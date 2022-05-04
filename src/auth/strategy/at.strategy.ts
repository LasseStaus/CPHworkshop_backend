import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/prisma/prisma.service'

type JwtPayload = {
  sub: string
  email: string
}

@Injectable() // provider
export class ATStrategy extends PassportStrategy(
  Strategy,
  'jwt_access_token' //this is the key name, defaults to "jwt" if nothing is written
) {
  constructor(
    configService: ConfigService,
    private prismaService: PrismaService
  ) {
    super({
      // passport jwt
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // how to get the token, extraxt from headers
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_AT_SECRET') // the secret password to sign the tokens
    })
  }

  //TODO Check video igen når han laver det her - hvorfor hedder den validate

  validate(payload: JwtPayload) {
    console.log('JWT', payload)
    return payload
  }

  /*   async validate(payload: {
    // payload from token
    sub: number
    email: string
  }) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub }
    })
    delete user.hash
  } */
}
