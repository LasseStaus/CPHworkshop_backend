import { ConsoleLogger, ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { Request } from 'express'

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
  validate(req: Request, payload: any) {
    const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim()
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed')
    return {
      ...payload,
      refreshToken
    }
  }
}
