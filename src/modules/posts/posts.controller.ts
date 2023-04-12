import {
  Body,
  Req,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  HttpCode,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { successMessages } from '@constants/index';
import { IResponseBase, IRequest } from '@interfaces/index';
import { AccessTokenGuard } from '@common/guards';

import { AddNewPostDTO, UpdatePostDTO } from './dto/posts.dto';
import { IGetPostResponse } from './posts.interface';
import PostsService from './posts.service';

@Controller({ path: 'post', version: ['1'] })
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post(['/new'])
  @UseInterceptors(FileInterceptor('previewImage'))
  async addNewPost(
    @Req() req: IRequest,
    @Body() payload: AddNewPostDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1000000, //max size: 1000kb
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    previewImage: Express.Multer.File,
  ): Promise<IResponseBase<{ post: IGetPostResponse }>> {
    const response = await this.postsService.create(req, previewImage, payload);
    return {
      data: { post: response },
      message: successMessages.SUCCESS,
      error: '',
    };
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get(['/:id'])
  async getPostById(
    @Param('id') id: string,
  ): Promise<IResponseBase<{ post: IGetPostResponse }>> {
    const response = await this.postsService.getPostById(id);
    return {
      data: { post: response },
      message: successMessages.SUCCESS,
      error: '',
    };
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(['/:id'])
  @UseInterceptors(FileInterceptor('previewImage'))
  async updatePostById(
    @Param('id') id: string,
    @Req() req: IRequest,
    @Body() payload: UpdatePostDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1000000, //max size: 1000kb
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    previewImage: Express.Multer.File,
  ): Promise<IResponseBase<{ post: IGetPostResponse }>> {
    const response = await this.postsService.updatePostById(
      req,
      id,
      previewImage,
      payload,
    );
    return {
      data: { post: response },
      message: successMessages.SUCCESS,
      error: '',
    };
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(['/:id'])
  async deletePostById(
    @Req() req: IRequest,
    @Param('id') id: string,
  ): Promise<IResponseBase<null>> {
    await this.postsService.deletePostById(req, id);
    return {
      data: null,
      message: successMessages.SUCCESS,
      error: '',
    };
  }
}
