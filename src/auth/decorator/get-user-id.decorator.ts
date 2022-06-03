import { createParamDecorator, ExecutionContext } from '@nestjs/common'

// costume decorator to get user id
export const GetUserId = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest() //req object of express

    return request.user['sub'] // sub from token as id
  }
)
