import {
  Body,
  Req,
  Controller,
  Post,
  Query,
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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { roles, successMessages } from '@constants';
import { IResponseBase, IRequest } from '@interfaces';
import { AccessTokenGuard, RolesGuard } from '@common/guards';
import { Roles } from '@common/guards/roles.decorator';

import {
  AddNewPostDTO,
  UpdatePostDTO,
  UpdatePostStatusDTO,
  GetListPostsDTO,
} from './dto/posts.dto';
import { IGetPostResponse, IListPosts } from './posts.interface';
import PostsService from './posts.service';

@ApiTags('Posts')
@Controller({ path: 'posts', version: ['1'] })
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AccessTokenGuard)
  @Post(['/new'])
  @UseInterceptors(FileInterceptor('previewImage'))
  @ApiOkResponse({ description: 'Add new post' })
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
    };
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get(['/list'])
  @Roles(roles.ADMIN)
  @ApiOkResponse({ description: 'Get list posts' })
  async getListPosts(
    @Query() query: GetListPostsDTO,
  ): Promise<IResponseBase<{ list: IListPosts }>> {
    const response = await this.postsService.getListPosts(query);
    return {
      data: { list: response },
      message: successMessages.SUCCESS,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get(['/:id'])
  @ApiOkResponse({ description: 'Get post by id' })
  async getPostById(
    @Param('id') id: string,
  ): Promise<IResponseBase<{ post: IGetPostResponse }>> {
    const response = await this.postsService.getPostById(id);
    return {
      data: { post: response },
      message: successMessages.SUCCESS,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Patch(['/:id'])
  @UseInterceptors(FileInterceptor('previewImage'))
  @ApiOkResponse({ description: 'Update post by id' })
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
    };
  }

  @UseGuards(AccessTokenGuard)
  @Delete(['/:id'])
  @ApiOkResponse({ description: 'Delete post by id' })
  async deletePostById(
    @Req() req: IRequest,
    @Param('id') id: string,
  ): Promise<IResponseBase<null>> {
    await this.postsService.deletePostById(req, id);
    return {
      data: null,
      message: successMessages.SUCCESS,
    };
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Patch(['/status/:id'])
  @Roles(roles.ADMIN)
  @ApiOkResponse({ description: 'Update post status by id' })
  async updatePostStatusById(
    @Param('id') id: string,
    @Body() payload: UpdatePostStatusDTO,
  ): Promise<IResponseBase<{ post: IGetPostResponse }>> {
    const response = await this.postsService.updatePostStatusById(id, payload);
    return {
      data: { post: response },
      message: successMessages.SUCCESS,
    };
  }
}
