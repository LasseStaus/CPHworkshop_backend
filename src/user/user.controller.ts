import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch
} from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUserId } from '../auth/decorator'
import { GetUser } from '../auth/decorator'
import { EditUserDto } from './dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private userservice: UserService) {}
  @Get('profile')
  getProfile(@GetUser('') user: User) {
    return user
  }

  @Patch('edit')
  editUser(@GetUser('') user: User, @Body() dto: EditUserDto) {
    return this.userservice.editUser(user.id, dto)
  }
}
