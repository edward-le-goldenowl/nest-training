import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    example: 'email@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'passWord@123',
  })
  @IsNotEmpty()
  password: string;
}
