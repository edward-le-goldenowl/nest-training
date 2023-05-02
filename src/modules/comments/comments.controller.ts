import {
  Body,
  Req,
  Controller,
  Post,
  Query,
  Get,
  Delete,
  Param,
  UseGuards,
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
import {
  IGetCommentResponse,
  IListComments,
  IGetLikeCommentResponse,
} from './comments.interface';
import CommentsService from './comments.service';

@ApiTags('Comments')
@Controller({ path: 'comments', version: ['1'] })
export default class PostsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AccessTokenGuard)
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
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get(['/list'])
  @ApiOkResponse({ description: 'Get list comments in post' })
  async getListCommentsInPost(
    @Query() query: GetListCommentsDTO,
  ): Promise<IResponseBase<{ list: IListComments }>> {
    const response = await this.commentsService.getListCommentsByPostId(query);
    return {
      data: { list: response },
      message: successMessages.SUCCESS,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get(['/:id'])
  @ApiOkResponse({ description: 'Get comment by id' })
  async getCommentById(
    @Param('id') id: string,
  ): Promise<IResponseBase<{ comment: IGetCommentResponse }>> {
    const response = await this.commentsService.getCommentById(id);
    return {
      data: { comment: response },
      message: successMessages.SUCCESS,
    };
  }

  @UseGuards(AccessTokenGuard)
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
    };
  }

  @UseGuards(AccessTokenGuard)
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
    };
  }

  @UseGuards(AccessTokenGuard)
  @Post(['/like/:id'])
  @ApiOkResponse({ description: 'Like a comment' })
  async likeComment(
    @Req() req: IRequest,
    @Param('id') id: string,
  ): Promise<IResponseBase<{ commentLike: IGetLikeCommentResponse }>> {
    const response = await this.commentsService.likeComment(req, id);
    return {
      data: { commentLike: response },
      message: successMessages.SUCCESS,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Delete(['/dislike/:id'])
  @ApiOkResponse({ description: 'Dislike comment by id' })
  async dislikeComment(
    @Param('id') id: string,
    @Req() req: IRequest,
  ): Promise<IResponseBase<null>> {
    await this.commentsService.dislikeComment(req, id);
    return {
      data: null,
      message: successMessages.SUCCESS,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get(['/likes/:id'])
  @ApiOkResponse({ description: 'Get all users like comment' })
  async getAllUsersLikeComment(
    @Req() req: IRequest,
    @Param('id') id: string,
  ): Promise<IResponseBase<{ likes: IGetLikeCommentResponse[] }>> {
    const response = await this.commentsService.getAllUsersLikeComment(req, id);
    return {
      data: { likes: response },
      message: successMessages.SUCCESS,
    };
  }
}
