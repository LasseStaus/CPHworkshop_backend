import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable() //enables depency injection? // implements OnModuleInit, OnModuleDestroy
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    // super will call constructor of the class that we are extending

    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL')
        }
      },
      // Enable any of these to see prisma logs
      // log: ['query', 'info', 'warn', 'error']
      log: ['warn', 'error']
    })
  }
  cleanDb() {
    return this.$transaction([
      this.booking.deleteMany(),
      this.user.deleteMany()
    ])
  }
}
