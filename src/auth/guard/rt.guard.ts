import { AuthGuard } from '@nestjs/passport'

export class RtGuard extends AuthGuard('jwt_refresh_token') {
  // RTGuard will protect using the rt.strategy.ts based on its key
  constructor() {
    super()
    // throws a 401 'Unauthorized' if access is not allowed
  }
}
