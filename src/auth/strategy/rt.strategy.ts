import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { refreshToken } from '../types'

@Injectable()
export class RTStrategy extends PassportStrategy(
  Strategy,
  'jwt_refresh_token'
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_RT_SECRET'),
      passReqToCallback: true
    })
  }
  validate(req: Request, payload: refreshToken) {
    const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim()
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed')
    return {
      ...payload,
      refreshToken
    }
  }
}
