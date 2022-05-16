import { Body, Controller, Get, Patch } from '@nestjs/common'
import { GetUserId } from '../auth/decorator'
import { EditUserDto } from './dto'
import { EditUserPasswordDto } from './dto/edit-user-password.dto'
import { UserService } from './user.service'

@Controller('user') // decorator that can recieve requests and produce responses with prefix route 'user'
export class UserController {
  constructor(private userservice: UserService) {}
  @Get('profile') // method and path
  getUser(@GetUserId() id: string) {
    // get info about the current user using costume decorator
    return this.userservice.getUser(id)
  }

  @Patch('edit/userInfo')
  editUser(@GetUserId() id: string, @Body() dto: EditUserDto) {
    return this.userservice.editUser(id, dto)
  }

  @Patch('edit/password')
  editUserPassword(@GetUserId() id: string, @Body() dto: EditUserPasswordDto) {
    return this.userservice.editUserPassword(id, dto)
  }
}
