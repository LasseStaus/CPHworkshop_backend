import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../../prisma/prisma.service'
@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt_access_token' //this is the key name, defaults to "jwt" if nothing is written
) {
  constructor(
    configService: ConfigService,
    private prismaService: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  //TODO Check video igen når han laver det her - hvorfor hedder den validate

  async validate(payload: { sub: number; email: string }) {
    console.log('in validate')

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub }
    })
    delete user.hash

    console.log('JWT Strategy', { payload })

    return 'finder en user'
  }
}
