import { createParamDecorator, ExecutionContext } from '@nestjs/common'

// costume decorator to get user id
export const GetUserId = createParamDecorator(
  (
    // TODO dont use undefined in decorator
    data: undefined,
    ctx: ExecutionContext
  ) => {
    const request: Express.Request = ctx.switchToHttp().getRequest()

    return request.user['sub'] // sub from token as id
  }
)
