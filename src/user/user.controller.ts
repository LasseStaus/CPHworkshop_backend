import { Body, Controller, Get, Patch } from '@nestjs/common'
import { GetUserId } from '../auth/decorator'
import { EditUserDto } from './dto'
import { EditUserPasswordDto } from './dto/edit-user-password.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private userservice: UserService) {}
  @Get('profile')
  getUser(@GetUserId() id: string) {
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
