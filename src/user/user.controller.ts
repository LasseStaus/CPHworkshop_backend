import { Controller, Get, Patch } from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from '../auth/decorator/get-user.decorator'

@Controller('user')
export class UserController {
  @Get('profile')
  getProfile(@GetUser('') user: User) {
    return user ? user : 'No user'
  }

  @Patch()
  editUser() {
    console.log('smt')
  }
}
