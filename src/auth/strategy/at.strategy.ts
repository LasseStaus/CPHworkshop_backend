import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../../prisma/prisma.service'

type JwtPayload = {
  sub: string
  email: string
}

@Injectable() // enables dependency injections
export class ATStrategy extends PassportStrategy(
  Strategy, // JWT strategy
  'jwt_access_token' //this is the key name, defaults to "jwt" if nothing is written
) {
  constructor(
    // dependency injections
    configService: ConfigService,
    // private prismaService: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // how to get the token, extract from headers
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_AT_SECRET') // from .env. Tokens are signed with the secret, the strategy needs det same secret to verify the token 
    })
  }

  validate(payload: JwtPayload) {
    // payload is the decoded object of the signed token with user info
    return payload // append the payload to the user object of the request object because of express --> req.user = payload
  }

}
