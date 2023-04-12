import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddNewPostDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(200)
  @MaxLength(1000000)
  content: string;
}

export class UpdatePostDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  @MinLength(200)
  @MaxLength(1000000)
  content: string;
}
