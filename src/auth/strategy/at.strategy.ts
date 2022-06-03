import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt } from 'passport-jwt'
import { PrismaService } from '../../prisma/prisma.service'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import configuration from 'src/config/configuration'

type JwtPayload = {
  sub: string
  email: string
}

@Injectable() // enables dependency injections
export class ATStrategy extends PassportStrategy(
  Strategy, // JWT strategy
  'jwt_access_token' //the key
) {
  constructor(
    // dependency injections
    configService: ConfigService
  ) {
    console.log(configService.get<string>('JWT_AT_SECRET'))

    super({
      // how to get the token, extract from headers
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // from .env. Tokens are signed with the secret, the strategy
      // needs det same secret to verify the token
      secretOrKey: configService.get<string>('JWT_AT_SECRET')
    })
  }

  // payload is the decoded object of the signed token with user info
  validate(payload: JwtPayload) {
    // append the payload to the token object of the
    // request object because of express --> req.token = payload
    return payload
  }
}
