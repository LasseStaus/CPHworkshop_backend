import { createParamDecorator, ExecutionContext } from '@nestjs/common'

// costume decorator to get user info
export const GetUser = createParamDecorator(
  (
    // TODO dont use undefined in decorator
    data: string | undefined,
    ctx: ExecutionContext
  ) => {
    console.log("LOG", ctx);
    console.log("DATA", data);

    const request: Express.Request = ctx
      .switchToHttp()
      .getRequest() //req object of express

    // if (!data) return request.user

    if (data) {
      return request.user[data]
    }
    console.log("USER USER", request.user);
    return request.user
  }
)
