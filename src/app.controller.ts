import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { PublicPath } from './auth/decorator'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @PublicPath()
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
