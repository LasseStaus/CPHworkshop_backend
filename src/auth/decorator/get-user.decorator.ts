import {
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common'

export const GetUser = createParamDecorator(
  (
    // TODO dont use undefined in decorator
    data: string | undefined,
    ctx: ExecutionContext
  ) => {
    const request: Express.Request = ctx
      .switchToHttp()
      .getRequest()

    return request.user
  }
)
