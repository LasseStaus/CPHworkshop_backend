import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt } from 'passport-jwt'
import { Strategy } from 'passport-jwt'
import { RefreshToken } from '../types'

@Injectable() // enables dependency injections
export class RTStrategy extends PassportStrategy(
  Strategy, // // JWT strategy
  'jwt_refresh_token' //the key
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // how to get the token, extract from headers
      secretOrKey: config.get<string>('JWT_RT_SECRET'), // // from .env. Tokens are signed with the secret, the strategy needs det same secret to verify the token
      passReqToCallback: true // returns the token
    })
  }
  validate(req: Request, payload: RefreshToken) {
    // payload is the decoded object of the signed token with user info
    console.log('BE - refresh validate', payload)

    const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim() // gets the refreshtoken from the Headers
    if (!refreshToken) throw new ForbiddenException('Refresh token tampered')

    return {
      ...payload,
      refreshToken
    }
  }
}
