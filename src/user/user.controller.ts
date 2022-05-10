import { Body, Controller, Get, Patch } from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser, GetUserId } from '../auth/decorator'
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
  // editUser(@GetUserId() user: number, @Body() dto: EditUserDto) {
  editUser(@GetUserId() id: number, @Body() dto: EditUserDto) {
    console.log("USER HER", id);
    // console.log("USER sub HER", user['sub']);

    return this.userservice.editUser(id, dto)
  }
}
