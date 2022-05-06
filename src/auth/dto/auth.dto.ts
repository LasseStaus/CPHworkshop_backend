import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  isPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'
import { MatchExact } from '../decorator/password-match.decorator'

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password: string
}

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak'
  })
  password: string

  @IsString()
  @IsNotEmpty()
  firstname: string

  @IsString()
  @IsNotEmpty()
  lastname: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^[1-9]\d{7}$/)
  phonenumber: any

  @IsString()
  @Length(8, 50)
  @MatchExact(SignupDto, (s) => s.password)
  passwordConfirm: string
}
