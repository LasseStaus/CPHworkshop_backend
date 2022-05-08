import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EditUserDto } from './dto'

@Injectable()
export class UserService {
  constructor(private prismaservice: PrismaService) {}

  async getUser(userId: number) {
    const user = await this.prismaservice.user.findUnique({
      where: {
        id: userId
      }
    })

    return user
  }

  async editUser(userId: number, dto: EditUserDto) {
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
}
