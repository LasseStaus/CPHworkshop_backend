import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
// Global guard
export class AtGuard extends AuthGuard('jwt_access_token') {
  // AtGuard will protect using the at.strategy.ts based on its key

  constructor(private reflector: Reflector) {
    super()
    // throws a 401 'Unauthorized' if access is not allowed
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      // where to look for 'isPublic'
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) return true // let me through to route by bypasing the AtGuard

    // else execute the AtGuard and look for access-token
    return super.canActivate(context)
  }
}
