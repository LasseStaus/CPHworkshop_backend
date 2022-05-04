import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetUserId = createParamDecorator(
  (
    // TODO dont use undefined in decorator
    data: undefined,
    ctx: ExecutionContext
  ) => {
    const request: Express.Request = ctx.switchToHttp().getRequest()

    return request.user['sub']
  }
)
