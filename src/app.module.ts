import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { AtGuard } from './auth/guard'
import { BookingModule } from './booking/booking.module'
import { configuration } from './config/configuration'
import { PrismaModule } from './prisma/prisma.module'
import { TicketModule } from './ticket/ticket.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      // to load the .env file throughout the app. Has a built in ConfigService
      envFilePath: `.env.local`,
      load: [configuration],
      isGlobal: true // expose ConfigService globally
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    BookingModule,
    TicketModule
  ],
  providers: [
    {
      // Declare the global guard of the application
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ]
})
export class AppModule {}
