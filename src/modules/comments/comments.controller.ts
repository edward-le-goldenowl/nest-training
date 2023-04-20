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
  Patch,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { successMessages } from '@constants';
import { IResponseBase, IRequest } from '@interfaces';
import { AccessTokenGuard } from '@common/guards';

import {
  AddNewCommentDTO,
  UpdateCommentDTO,
  GetListCommentsDTO,
} from './dto/comments.dto';
import { IGetCommentResponse, IListComments } from './comments.interface';
import CommentsService from './comments.service';

@ApiTags('Comments')
@Controller({ path: 'comments', version: ['1'] })
export default class PostsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post(['/new'])
  @ApiOkResponse({ description: 'Add new comment in post' })
  async addNewCommentInPost(
    @Req() req: IRequest,
    @Body() payload: AddNewCommentDTO,
  ): Promise<IResponseBase<{ comment: IGetCommentResponse }>> {
    const response = await this.commentsService.addNewCommentInPost(
      req,
      payload,
    );
    return {
      data: { comment: response },
      message: successMessages.SUCCESS,
      error: '',
    };
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get(['/list'])
  @ApiOkResponse({ description: 'Get list comments in post' })
  async getListCommentsInPost(
    @Query() query: GetListCommentsDTO,
  ): Promise<IResponseBase<{ list: IListComments }>> {
    const response = await this.commentsService.getListCommentsByPostId(query);
    return {
      data: { list: response },
      message: successMessages.SUCCESS,
      error: '',
    };
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get(['/:id'])
  @ApiOkResponse({ description: 'Get comment by id' })
  async getCommentById(
    @Param('id') id: string,
  ): Promise<IResponseBase<{ comment: IGetCommentResponse }>> {
    const response = await this.commentsService.getCommentById(id);
    return {
      data: { comment: response },
      message: successMessages.SUCCESS,
      error: '',
    };
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(['/:id'])
  @ApiOkResponse({ description: 'Delete comment by id' })
  async deleteCommentById(
    @Param('id') id: string,
    @Req() req: IRequest,
  ): Promise<IResponseBase<null>> {
    await this.commentsService.deleteCommentById(req, id);
    return {
      data: null,
      message: successMessages.SUCCESS,
      error: '',
    };
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(['/:id'])
  @ApiOkResponse({ description: 'Update comment by id' })
  async updateCommentById(
    @Param('id') id: string,
    @Req() req: IRequest,
    @Body() payload: UpdateCommentDTO,
  ): Promise<IResponseBase<{ comment: IGetCommentResponse }>> {
    const response = await this.commentsService.updateCommentById(
      req,
      id,
      payload,
    );
    return {
      data: { comment: response },
      message: successMessages.SUCCESS,
      error: '',
    };
  }
}
