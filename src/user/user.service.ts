import { ForbiddenException, HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EditUserDto } from './dto'
import { EditUserPasswordDto } from './dto/edit-user-password.dto'
import * as argon from 'argon2'
import { hashConfig } from '../auth/helpers/hashconfig'

@Injectable()
export class UserService {
  constructor(private prismaservice: PrismaService) {}

  async getUser(userId: string) {
    const user = await this.prismaservice.user.findUnique({
      where: {
        id: userId
      },
      include: {
        ticket: true,
        purchase: true,
        bookings: true
      }
    })

    return user
  }

  async editUser(userId: string, dto: EditUserDto) {
    try {
      const user = await this.prismaservice.user.update({
        where: {
          id: userId
        },
        data: {
          ...dto
        }
      })

      return user
    } catch (err) {
      throw new Error('Password update failed')
    }
  }

  async editUserPassword(userId: string, dto: EditUserPasswordDto) {
    const user = await this.prismaservice.user.findUnique({
      where: {
        id: userId
      }
    })

    // check for user
    if (!user) {
      throw new ForbiddenException('Something went wrong, try agian later')
    }

    // compare passwords
    const pwMatches = await argon.verify(user.hash, dto.passwordCurrent, {
      ...hashConfig
    })
    if (!pwMatches)
      throw new ForbiddenException(
        'Current password does not match password of profile, try again'
      )

    // new passwords
    try {
      const newHash = await argon.hash(dto.passwordNew, { ...hashConfig })
      await this.prismaservice.user.update({
        where: {
          id: userId
        },
        data: {
          hash: newHash
        }
      })
      return { message: 'Password updated successfully' }
    } catch (err) {
      throw new Error('Something went wrong, try agian later')
    }
  }
}
