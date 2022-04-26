import { AuthGuard } from '@nestjs/passport'

export class JwtGuard extends AuthGuard(
  'jwt_access_token'
) {
  constructor() {
    super()
  }
}
