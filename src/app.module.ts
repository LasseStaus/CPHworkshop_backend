import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { APP_GUARD } from '@nestjs/core'
import { AtGuard } from './auth/guard'
import { BookingController } from './booking/booking.controller'
import { BookingService } from './booking/booking.service'
import { BookingModule } from './booking/booking.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      // to load the .env file throughout the app. Has a built in ConfigService
      isGlobal: true // expose ConfigService globally
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    BookingModule
  ],
  providers: [
    {
      // Declare the global guard of the application
      provide: APP_GUARD,
      useClass: AtGuard
    },
    BookingService
  ],
  controllers: [BookingController]
})
export class AppModule {}
