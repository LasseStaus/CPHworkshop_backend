import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // super will call constructor of the class that we are extending

    super({
      datasources: {
        db: {
          url: 'postgresql://postgres:password@localhost:5434/nestdb?schema=public' //this.process.env.
        }
      }
    })
  }
}
