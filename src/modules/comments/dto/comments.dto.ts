import { IsNotEmpty, IsString, MaxLength, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AddNewCommentDTO {
  @ApiProperty({
    example: 'postId_1',
  })
  @IsNotEmpty()
  @IsString()
  postId: string;

  @ApiProperty({
    example: 'Content here',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  content: string;
}

export class UpdateCommentDTO {
  @ApiProperty({
    example: 'Content here',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  content: string;
}

export class GetListCommentsDTO {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  page: number;

  @ApiProperty({
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  limit: number;

  @ApiProperty({
    example: 'postId_1',
  })
  @IsNotEmpty()
  @IsString()
  postId: string;
}
