import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable() //enables depency injection?
export class PrismaService extends PrismaClient // implements OnModuleInit, OnModuleDestroy 
{
  constructor(config: ConfigService) {
    // super will call constructor of the class that we are extending

    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL')
        }
      }
    })
    // onModuleInit() {
    // await this.$connect();
    //}
    // onModuledestroy() {
    // await this.$connect();
    //}
  }
}
