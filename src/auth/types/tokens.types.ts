export type Tokens = {
  access_token: string
  refresh_token: string
}

export type RefreshToken = {
  sub: number
  email: string
  iat: number
  exp: number
}
