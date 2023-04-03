import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsEmail,
  IsDateString,
} from 'class-validator';
import { Match } from './match.decorator';

export class SignUpDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDateString()
  dob: Date;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password')
  passwordConfirm: string;
}
