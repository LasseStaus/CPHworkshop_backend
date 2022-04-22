import { Injectable } from '@nestjs/common'

@Injectable({})
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signin() {
    return { msg: 'I have signed in' }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signup() {
    return { msg: 'I have signed up' }
  }
}
