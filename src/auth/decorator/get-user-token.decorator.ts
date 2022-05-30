import { createParamDecorator, ExecutionContext } from '@nestjs/common'

// costume decorator to get user info
export const GetUserToken = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest() //req object of express

    if (data) {
      return request.user[data]
    }
    return request.user
  }
)
