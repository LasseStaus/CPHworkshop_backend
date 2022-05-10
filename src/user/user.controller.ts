import { Body, Controller, Get, Patch } from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from '../auth/decorator'
import { EditUserDto } from './dto'
import { UserService } from './user.service'

@Controller('user') // decorator that can recieve requests and produce responses with prefix route 'user'
export class UserController {
  constructor(private userservice: UserService) { }
  @Get('profile') // method and path
  getProfile(@GetUser('') user: User) { // get info about the current user using costume decorator
    return user
  }

  @Patch('edit')
  editUser(@GetUser('') user: User, @Body() dto: EditUserDto) {
    return this.userservice.editUser(user.id, dto)
  }
}
