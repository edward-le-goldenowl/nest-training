import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsEmail,
  IsDateString,
  IsIn,
  IsOptional,
} from 'class-validator';
import { Match } from './match.decorator';

export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

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

  @IsIn(['admin', 'member'])
  role: string;
}

export class UpdateProfileDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsDateString()
  dob: string;
}
