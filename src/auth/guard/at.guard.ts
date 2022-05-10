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
    // if true, lets sign in
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      // where to look for 'isPublic'
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) return true // let me sign in by bypasing the AtGuard

    // else execute the AtGuard and block
    return super.canActivate(context)
  }
}
