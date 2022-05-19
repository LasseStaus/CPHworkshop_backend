import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable() //enables depency injection // implements OnModuleInit, OnModuleDestroy
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    // super will call constructor of the class that we are extending

    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL') // .env file
        }
      },
      // Enable any of these to see prisma logs
      log: ['query', 'info', 'warn', 'error']
    })
  }
  cleanDb() {
    return this.$transaction([
      this.booking.deleteMany(),
      this.user.deleteMany()
    ])
  }
}
