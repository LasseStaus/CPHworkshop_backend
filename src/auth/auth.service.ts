import {
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { User, Booking } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { domainToASCII } from 'url'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password)

    try {
      const user =
        await this.prismaService.user.create({
          data: {
            email: dto.email,
            hash
          }
        })

      delete user.hash
      return user
    } catch (err) {
      if (
        err instanceof
        PrismaClientKnownRequestError
      ) {
        if ((err.code = 'P2002')) {
          throw new ForbiddenException(
            'Credentials taken'
          )
        }
        console.log('Prisma Error', err)
      }
      console.log(err)
    }
  }

  async signin(dto: AuthDto) {
    const user =
      await this.prismaService.user.findUnique({
        where: {
          email: dto.email
        }
      })

    if (!user)
      throw new ForbiddenException(
        'Credentials Incorret'
      )

    const pwMatches = await argon.verify(
      user.hash,
      dto.password
    )
    if (!pwMatches)
      throw new ForbiddenException(
        'credentials incorrect'
      )
    //optional delete user.hash
    delete user.hash
    return this.signToken(user.id, user.email)
  }

  async signToken(
    userId: number,
    email: string
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email
    }
    const secret =
      this.configService.get('JWT_SECRET')

    const token = await this.jwtService.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: secret
      }
    )
    return { access_token: token }
  }
}
