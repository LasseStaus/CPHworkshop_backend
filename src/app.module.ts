import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { AtGuard } from './auth/guard'
import { BookingModule } from './booking/booking.module'
import { PrismaModule } from './prisma/prisma.module'
import { TicketModule } from './ticket/ticket.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      // to load the .env file throughout the app. Has a built in ConfigService
      envFilePath: '.env',

      isGlobal: true // expose ConfigService globally
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    BookingModule,
    TicketModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Declare the global guard of the application
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ]
})
export class AppModule {}
