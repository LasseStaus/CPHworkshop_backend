import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ATStrategy, RTStrategy } from './strategy'

@Module({
  imports: [JwtModule.register({})], // Declaration of JwtModule in auth. Is costumized in the service
  controllers: [AuthController],
  providers: [AuthService, ATStrategy, RTStrategy] // configure services
})
export class AuthModule {}
