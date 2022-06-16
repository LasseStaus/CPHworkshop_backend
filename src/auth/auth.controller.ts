import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { GetUserToken, GetUserId, PublicPath } from './decorator'
import { LoginDto, SignupDto } from './dto'
import { RtGuard } from './guard'
import { Tokens } from './types'

@Controller('auth') // decorator that can recieve requests and produce responses with prefix route
export class AuthController {
  // Instansiate the auth service using dependency injection
  // private syntax allows us to both declare and initialize the AuthService immediately in the same
  constructor(private authService: AuthService) {}

  @PublicPath() // escape ATGuard
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  // @body allows us to get the body of the request
  signup(
    @Body() dto: SignupDto
  ): Promise<{ message: string } | ForbiddenException | Error> {
    // return the function from AuthService
    return this.authService.signup(dto)
  }

  @PublicPath() // escape ATGuard
  @HttpCode(HttpStatus.OK)
  @Post('local/signin')
  signin(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.signin(dto)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUserId() userId: string) {
    return this.authService.logout(userId)
  }

  @PublicPath()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    // using costume decorators
    @GetUserId() userId: string,
    @GetUserToken('refreshToken') refreshToken: string
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken)
  }
}
