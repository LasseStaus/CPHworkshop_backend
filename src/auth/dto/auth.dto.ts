import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  firstname: string

  @IsString()
  @IsNotEmpty()
  lastname: string

  @IsString()
  @IsNotEmpty()
  phone: string
}

export class AuthSigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
