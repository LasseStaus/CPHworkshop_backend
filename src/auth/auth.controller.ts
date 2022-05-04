import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { GetUser, GetUserId, PublicPath } from './decorator'
import { AuthDto } from './dto'
import { AtGuard, RtGuard } from './guard'
import { Tokens } from './types'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicPath()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto)
  }

  @PublicPath()
  // needs meta data to donts use AT guad
  @HttpCode(HttpStatus.OK)
  @Post('local/signin')
  login(
    @Req() req,
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res
    //TODO CHANGE ANY
  ): Promise<any> {
    return this.authService.signin(dto, res)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUserId() userId: number) {
    return this.authService.logout(userId)
  }

  @PublicPath()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetUserId() userId: number,
    @GetUser('refreshToken') refreshToken: string
  ) {
    return this.authService.refreshTokens(userId, refreshToken)
  }
}
