import {
  Controller,
  Get,
  Patch,
  UseGuards
} from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from 'src/auth/decorator'
import { JwtGuard } from 'src/auth/guard'

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  @Get('profile')
  getProfile(@GetUser('') user: User) {
    return user ? user : 'nothing'
  }

  @Patch()
  editUser() {
    console.log('smt')
  }
}
