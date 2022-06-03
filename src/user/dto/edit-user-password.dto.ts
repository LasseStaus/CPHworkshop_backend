import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'
import { MatchExact } from '../../auth/decorator/password-match.decorator'

export class EditUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  passwordCurrent?: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak'
  })
  passwordNew: string

  @IsString()
  @Length(8, 50)
  @MatchExact(EditUserPasswordDto, (s) => s.passwordNew)
  passwordNewConfirm?: string
}
