import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ATStrategy, RTStrategy } from './strategy'
import { JwtStrategy } from './strategy/jwt.strategy'

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, ATStrategy, RTStrategy, JwtStrategy]
})
export class AuthModule {}
