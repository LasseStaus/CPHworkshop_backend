import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global() // expose prisma to the whole app
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule { }
