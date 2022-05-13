import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EditUserDto } from './dto'
import { EditUserPasswordDto } from './dto/edit-user-password.dto'
import * as argon from 'argon2'
import { hashConfig } from 'src/auth/helpers/hashconfig'

@Injectable()
export class UserService {
  constructor(private prismaservice: PrismaService) { }

  async getUser(userId: string) {
    const user = await this.prismaservice.user.findUnique({
      where: {
        id: userId
      }
    })

    return user
  }

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prismaservice.user.update({
      where: {
        id: userId
      },
      data: {
        ...dto
      }
    })

    return user
  }

  async editUserPassword(userId: string, dto: EditUserPasswordDto) {

    const user = await this.prismaservice.user.findUnique({
      where: {
        id: userId
      },
    });

    // check for user
    if (!user) {
      throw new ForbiddenException('BE - user does not exist')
    }

    // compare passwords
    const pwMatches = await argon.verify(user.hash, dto.passwordCurrent, {
      ...hashConfig
    })
    if (!pwMatches) throw new ForbiddenException('BE - current password does not match user password')

    // new passwords
    try {
      const newHash = await argon.hash(dto.password, { ...hashConfig })
      await this.prismaservice.user.update({
        where: {
          id: userId
        },
        data: {
          hash: newHash
        }
      })
      return { message: 'BE - password hash updated successfully' }
    } catch (err) {
      return { message: 'BE - BE - password hash NOT updated', error: err }
    }
  }
}
