import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class AtGuard extends AuthGuard('jwt_access_token') {
  // maybe remove global guard

  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    // if true, lets sign in
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) return true

    return super.canActivate(context)
  }
}
