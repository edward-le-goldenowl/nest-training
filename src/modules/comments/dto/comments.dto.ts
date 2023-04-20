import { IsNotEmpty, IsString, MaxLength, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AddNewCommentDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  postId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  content: string;
}

export class UpdateCommentDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  content: string;
}

export class GetListCommentsDTO {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  page: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  limit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  postId: string;
}
