import { Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from 'src/auth/decorator'

@Controller('user') // decorator that can recieve requests and produce responses with prefix route 'user'
export class UserController {
  @Get('profile') // method and path
  getProfile(@GetUser('') user: User) { // get info about the current user using costume decorator
    return user ? user : 'No user'
  }

  @Patch()
  editUser() {
    console.log('smt')
  }
}
