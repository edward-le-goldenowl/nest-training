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
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Match } from './match.decorator';

export class RegisterDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsDateString()
  dob: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password')
  passwordConfirm: string;

  @ApiProperty()
  @IsIn(['admin', 'member'])
  role: string;
}

export class UpdateProfileDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dob: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber('VN')
  phone: string;
}
