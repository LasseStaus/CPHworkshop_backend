import { AuthGuard } from '@nestjs/passport'

export class RtGuard extends AuthGuard('jwt_refresh_token') {
  constructor() {
    super()
  }
}
