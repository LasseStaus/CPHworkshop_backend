import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  firstname?: string

  @IsString()
  @IsNotEmpty()
  lastname?: string

  @IsString()
  @IsNotEmpty()
  phonenumber?: string
}
