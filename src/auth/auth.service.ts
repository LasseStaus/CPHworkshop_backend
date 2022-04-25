import {
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { Users, Booking } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { domainToASCII } from 'url'

@Injectable()
export class AuthService {
  constructor(
    private prismaservice: PrismaService
  ) {}
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password)

    try {
      const user =
        await this.prismaservice.users.create({
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
      await this.prismaservice.users.findUnique({
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

    delete user.hash
    return user
  }
}
