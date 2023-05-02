import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsIn,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AddNewPostDTO {
  @ApiProperty({
    example: 'Title here',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Content here',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(200)
  @MaxLength(1000000)
  content: string;
}

export class UpdatePostDTO {
  @ApiProperty({
    example: 'Title here',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Content here',
  })
  @IsOptional()
  @IsString()
  @MinLength(200)
  @MaxLength(1000000)
  content: string;
}

export class UpdatePostStatusDTO {
  @ApiProperty({
    example: 'approved',
  })
  @IsIn(['approved', 'rejected'])
  status: string;
}

export class GetListPostsDTO {
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
    example: 'pending',
  })
  @IsOptional()
  status: string;
}
