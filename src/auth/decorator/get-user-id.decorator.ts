import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetUserId = createParamDecorator(
  (
    // TODO dont use undefined in decorator
    data: undefined,
    ctx: ExecutionContext
  ) => {
    const request: Express.Request = ctx.switchToHttp().getRequest()

    // console.log('get-user ID', data)
    return request.user['sub']
  }
)
