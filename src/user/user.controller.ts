import { Body, Controller, Get, Patch } from '@nestjs/common'
import { GetUserId } from '../auth/decorator'
import { EditUserDto } from './dto'
import { UserService } from './user.service'

@Controller('user') // decorator that can recieve requests and produce responses with prefix route 'user'
export class UserController {
  constructor(private userservice: UserService) { }
  @Get('profile') // method and path
  getUser(@GetUserId() id: number) {
    // get info about the current user using costume decorator
    return this.userservice.getUser(id)
  }

  @Patch('edit')
  editUser(@GetUserId() id: number, @Body() dto: EditUserDto) {
    return this.userservice.editUser(id, dto)
  }
}
