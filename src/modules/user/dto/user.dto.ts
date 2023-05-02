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
  @ApiProperty({
    example: 'email@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Edward Le',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: '1998-12-29',
  })
  @IsDateString()
  dob: Date;

  @ApiProperty({
    description:
      'Has to match a regular expression: ((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/',
    example: 'passWord@123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @ApiProperty({
    example: 'passWord@123',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password')
  passwordConfirm: string;

  @ApiProperty({
    example: 'admin',
  })
  @IsIn(['admin', 'member'])
  role: string;
}

export class UpdateProfileDTO {
  @ApiProperty({
    example: 'Edward Le',
  })
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: '1998-12-29',
  })
  @IsOptional()
  @IsDateString()
  dob: Date;

  @ApiProperty({
    example: '143 Tran Hung Dao Street P5 D3 HCM City',
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    example: '+84366591078',
  })
  @IsOptional()
  @IsPhoneNumber('VN')
  phone: string;
}
