import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IRequest } from '@interfaces';
import { errorMessages, errorCodes, roles } from '@constants';
import UserService from '@user/user.service';
import PostsService from '@posts/posts.service';
import CatchError from '@utils/catchError';

import CommentsEntity from './entities/comments.entity';
import CommentLikesEntity from './entities/commentLikes.entity';
import {
  INewCommentPayload,
  IGetCommentResponse,
  IUpdateCommentPayload,
  IGetListCommentsQuery,
  IListComments,
  ILikeCommentPayload,
  IGetLikeCommentResponse,
} from './comments.interface';

@Injectable()
export default class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private commentsRepository: Repository<CommentsEntity>,
    @InjectRepository(CommentLikesEntity)
    private commentLikesRepository: Repository<CommentLikesEntity>,
    private userService: UserService,
    private postsService: PostsService,
  ) {}

  public async addNewCommentInPost(
    req: IRequest,
    payload: INewCommentPayload,
  ): Promise<IGetCommentResponse> {
    try {
      const user = req.user;
      const { postId } = payload;
      if (user) {
        const userId = user['id'];
        const currentPost = await this.postsService.getPostById(postId);
        if (!currentPost) {
          throw new ForbiddenException(errorMessages.ADD_NEW_COMMENT_FAILED, {
            cause: new Error(),
            description: errorCodes.ERR_ADD_NEW_COMMENT_FAILED,
          });
        }
        const newCommentPayload: INewCommentPayload = {
          ...payload,
          userId,
        };

        const newComment = this.commentsRepository.create(newCommentPayload);
        const savedComment = await this.commentsRepository.save(newComment);
        return savedComment;
      }
      throw new ForbiddenException(errorMessages.ADD_NEW_COMMENT_FAILED, {
        cause: new Error(),
        description: errorCodes.ERR_ADD_NEW_COMMENT_FAILED,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async getCommentById(id: string): Promise<IGetCommentResponse> {
    try {
      const comment = await this.commentsRepository
        .createQueryBuilder('comments')
        .where('comments.id = :id', { id })
        .getOne();
      if (comment) return comment;
      throw new NotFoundException(errorMessages.NOT_FOUND_COMMENT, {
        cause: new Error(),
        description: errorCodes.ERR_COMMENT_NOT_FOUND,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async deleteCommentById(req: IRequest, id: string) {
    try {
      const user = req.user;
      if (!user)
        throw new ForbiddenException(errorMessages.DELETE_COMMENT_FAILED, {
          cause: new Error(),
          description: errorCodes.ERR_DELETE_COMMENT_FAILED,
        });
      const userId = user['id'];
      const account = await this.userService.getAccountById(userId);
      const currentComment = await this.getCommentById(id);
      if (
        !account ||
        !currentComment ||
        (currentComment &&
          currentComment.userId !== userId &&
          account.role === roles.MEMBER)
      ) {
        throw new ForbiddenException(errorMessages.DELETE_COMMENT_FAILED, {
          cause: new Error(),
          description: errorCodes.ERR_DELETE_COMMENT_FAILED,
        });
      }
      await this.commentsRepository
        .createQueryBuilder('comments')
        .softDelete()
        .where('comments.id = :id', { id })
        .execute();
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async updateCommentById(
    req: IRequest,
    id: string,
    payload: IUpdateCommentPayload,
  ) {
    try {
      const user = req.user;
      if (!user)
        throw new ForbiddenException(errorMessages.DELETE_COMMENT_FAILED, {
          cause: new Error(),
          description: errorCodes.ERR_DELETE_COMMENT_FAILED,
        });
      const userId = user['id'];
      const account = await this.userService.getAccountById(userId);
      const currentComment = await this.getCommentById(id);
      if (
        !account ||
        !currentComment ||
        (currentComment &&
          currentComment.userId !== userId &&
          account.role === roles.MEMBER)
      ) {
        throw new ForbiddenException(errorMessages.DELETE_COMMENT_FAILED, {
          cause: new Error(),
          description: errorCodes.ERR_DELETE_COMMENT_FAILED,
        });
      }
      const dataUpdate: IUpdateCommentPayload = { ...payload };
      const updatedResponse = await this.commentsRepository
        .createQueryBuilder('comments')
        .update()
        .set(dataUpdate)
        .where('comments.id = :id', { id })
        .returning('*')
        .execute();
      return updatedResponse.raw;
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async getListCommentsByPostId(
    query: IGetListCommentsQuery,
  ): Promise<IListComments> {
    try {
      const { page = 1, limit = 10, postId } = query;
      await this.postsService.getPostById(postId);
      const skip = (page - 1) * limit;
      const totalCount = await this.commentsRepository
        .createQueryBuilder('comments')
        .where('comments.postId = :postId', { postId })
        .getCount();
      const totalPages = Math.ceil(totalCount / limit);
      const comments = await this.commentsRepository
        .createQueryBuilder('comments')
        .where('comments.postId = :postId', { postId })
        .skip(skip)
        .take(limit)
        .getMany();
      return {
        comments: comments,
        pagination: {
          limit: limit,
          currentPage: page,
          count: comments.length,
          totalPages: totalPages,
        },
      };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async getCommentLikeById(
    id: string,
  ): Promise<IGetLikeCommentResponse> {
    try {
      const commentLike = await this.commentLikesRepository
        .createQueryBuilder('cl')
        .innerJoin('cl.comment', 'comment')
        .innerJoin('comment.post', 'post')
        .innerJoin('cl.user', 'account')
        .innerJoin('account.usersProfile', 'profile')
        .select([
          'cl.id as id',
          'cl.createdAt as "createdAt"',
          'cl.updatedAt as "updatedAt"',
          'comment.id as "commentId"',
          'post.id as "postId"',
          'account.id as "userId"',
          'profile.fullName as fullName',
        ])
        .where('cl.id = :id', { id })
        .getRawOne();
      if (commentLike) return commentLike;
      throw new NotFoundException(errorMessages.NOT_FOUND_POST, {
        cause: new Error(),
        description: errorCodes.ERR_POST_NOT_FOUND,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async likeComment(
    req: IRequest,
    commentId: string,
  ): Promise<IGetLikeCommentResponse> {
    try {
      const user = req.user;
      if (!user)
        throw new ForbiddenException(errorMessages.ADD_NEW_COMMENT_FAILED, {
          cause: new Error(),
          description: errorCodes.ERR_ADD_NEW_COMMENT_FAILED,
        });
      const userId = user['id'];
      const currentComment = await this.getCommentById(commentId);
      const currentCommentLike = await this.commentLikesRepository
        .createQueryBuilder('commentLikes')
        .where('commentLikes.userId = :userId', { userId })
        .andWhere('commentLikes.commentId = :commentId', { commentId })
        .getOne();
      if (!currentComment || currentCommentLike) {
        throw new ForbiddenException(errorMessages.LIKE_COMMENT_FAILED, {
          cause: new Error(),
          description: errorCodes.ERR_LIKE_COMMENT_FAILED,
        });
      }
      const likeCommentPayload: ILikeCommentPayload = {
        commentId,
        userId,
      };
      const newLike = this.commentLikesRepository.create(likeCommentPayload);
      const savedLike = await this.commentLikesRepository.save(newLike);
      return this.getCommentLikeById(savedLike.id);
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async dislikeComment(req: IRequest, commentId: string) {
    try {
      const user = req.user;
      if (!user)
        throw new ForbiddenException(errorMessages.DISLIKE_COMMENT_FAILED, {
          cause: new Error(),
          description: errorCodes.ERR_DISLIKE_COMMENT_FAILED,
        });
      const userId = user['id'];
      const currentCommentLike = await this.commentLikesRepository
        .createQueryBuilder('commentLikes')
        .where('commentLikes.userId = :userId', { userId })
        .andWhere('commentLikes.commentId = :commentId', { commentId })
        .getOne();
      if (!currentCommentLike || currentCommentLike.userId !== userId) {
        throw new ForbiddenException(errorMessages.DISLIKE_COMMENT_FAILED, {
          cause: new Error(),
          description: errorCodes.ERR_DISLIKE_COMMENT_FAILED,
        });
      }
      await this.commentLikesRepository
        .createQueryBuilder()
        .delete()
        .where('userId = :userId', { userId: userId })
        .andWhere('commentId = :commentId', { commentId: commentId })
        .execute();
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async getAllUsersLikeComment(
    req: IRequest,
    commentId: string,
  ): Promise<IGetLikeCommentResponse[]> {
    try {
      const user = req.user;
      if (!user)
        throw new ForbiddenException(errorMessages.DISLIKE_COMMENT_FAILED, {
          cause: new Error(),
          description: errorCodes.ERR_DISLIKE_COMMENT_FAILED,
        });
      const allUsersLikeComment: IGetLikeCommentResponse[] =
        await this.commentLikesRepository
          .createQueryBuilder('cl')
          .innerJoin('cl.comment', 'comment')
          .innerJoin('comment.post', 'post')
          .innerJoin('cl.user', 'account')
          .innerJoin('account.usersProfile', 'profile')
          .select([
            'cl.id as id',
            'cl.createdAt as "createdAt"',
            'cl.updatedAt as "updatedAt"',
            'comment.id as "commentId"',
            'post.id as "postId"',
            'account.id as "userId"',
            'profile.fullName as fullName',
          ])
          .where('cl.commentId = :commentId', { commentId })
          .getRawMany();
      return allUsersLikeComment;
    } catch (error) {
      throw new CatchError(error);
    }
  }
}
