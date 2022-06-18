import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorator/check-role.decorator'
import { Role } from '../enums/role.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // access the route's role
    //@Roles(Role.Admin) --> ['Admin']
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredRoles) {
      // let me through to route by bypasing the role guard
      // if no roles are required
      return true
    }

    const { user } = context.switchToHttp().getRequest()
    // compare the role assigned to the current user
    // to the actual role required by the current route
    return requiredRoles.some((role) => user.role?.includes(role))
  }
}
