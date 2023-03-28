import { IsNotEmpty, IsString } from 'class-validator';

export class LoginInfoDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
