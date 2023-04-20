import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IRequest } from '@interfaces';
import { errorMessages, errorCodes, roles } from '@constants';
import { CloudinaryService } from '@cloudinary/cloudinary.service';
import UserService from '@user/user.service';
import CatchError from '@utils/catchError';

import PostsEntity from './entities/posts.entity';
import {
  IListPosts,
  INewPostPayload,
  IGetPostResponse,
  IUpdatePostPayload,
  IUpdatePostStatusPayload,
  IGetListPostsQuery,
} from './posts.interface';
import {
  AddNewPostDTO,
  UpdatePostDTO,
  UpdatePostStatusDTO,
} from './dto/posts.dto';

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private postsRepository: Repository<PostsEntity>,
    private cloudinary: CloudinaryService,
    private userService: UserService,
  ) {}

  public async create(
    req: IRequest,
    file: Express.Multer.File,
    payload: AddNewPostDTO,
  ): Promise<IGetPostResponse> {
    try {
      const user = req.user;
      if (user) {
        const id = user['id'];
        if (!id)
          throw new ForbiddenException(errorMessages.CREATE_NEW_POST_FAILED, {
            cause: new Error(),
            description: errorCodes.ERR_CREATE_NEW_POST,
          });
        const newPostPayload: INewPostPayload = {
          ...payload,
          authorId: id,
        };

        if (file) {
          const folder = 'posts_preview';
          const uploadResponse = await this.cloudinary.uploadImage(
            file,
            folder,
          );
          newPostPayload['previewImage'] = uploadResponse.secure_url;
        }
        const newPost = this.postsRepository.create(newPostPayload);
        const savedPost = await this.postsRepository.save(newPost);
        return savedPost;
      }
      throw new ForbiddenException(errorMessages.CREATE_NEW_POST_FAILED, {
        cause: new Error(),
        description: errorCodes.ERR_CREATE_NEW_POST,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async deletePostById(req: IRequest, id: string) {
    try {
      const user = req.user;
      if (user) {
        const userId = user['id'];
        const account = await this.userService.getAccountById(userId);
        const currentPost = await this.getPostById(id);
        if (
          !account ||
          !currentPost ||
          (currentPost &&
            currentPost.authorId !== userId &&
            account.role === roles.MEMBER)
        ) {
          throw new ForbiddenException(errorMessages.DELETE_POST_FAILED, {
            cause: new Error(),
            description: errorCodes.ERR_DELETE_POST_FAILED,
          });
        }
        await this.postsRepository
          .createQueryBuilder('posts')
          .softDelete()
          .where('id = :id', { id })
          .execute();
      }
      throw new ForbiddenException(errorMessages.DELETE_POST_FAILED, {
        cause: new Error(),
        description: errorCodes.ERR_DELETE_POST_FAILED,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async getPostById(id: string): Promise<IGetPostResponse> {
    try {
      const post = await this.postsRepository
        .createQueryBuilder('posts')
        .where('posts.id = :id', { id })
        .getOne();
      if (post) return post;
      throw new NotFoundException(errorMessages.NOT_FOUND_POST, {
        cause: new Error(),
        description: errorCodes.ERR_POST_NOT_FOUND,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async updatePostById(
    req: IRequest,
    id: string,
    file: Express.Multer.File,
    payload: UpdatePostDTO,
  ): Promise<IGetPostResponse> {
    try {
      const user = req.user;
      if (user) {
        const userId = user['id'];
        const account = await this.userService.getAccountById(userId);
        const currentPost = await this.getPostById(id);
        if (
          !account ||
          !currentPost ||
          (currentPost &&
            currentPost.authorId !== userId &&
            account.role === roles.MEMBER)
        ) {
          throw new ForbiddenException(errorMessages.UPDATE_POST_FAILED, {
            cause: new Error(),
            description: errorCodes.ERR_POST_UPDATE_FAILED,
          });
        }
        const dataUpdate: IUpdatePostPayload = {
          ...payload,
        };

        if (file) {
          const folder = 'posts_preview';
          const uploadResponse = await this.cloudinary.uploadImage(
            file,
            folder,
          );
          dataUpdate['previewImage'] = uploadResponse.secure_url;
        }
        const updatedResponse = await this.postsRepository
          .createQueryBuilder('posts')
          .update()
          .set(dataUpdate)
          .where('id = :id', { id })
          .returning('*')
          .execute();
        return updatedResponse.raw;
      }
      throw new ForbiddenException(errorMessages.UPDATE_POST_FAILED, {
        cause: new Error(),
        description: errorCodes.ERR_POST_UPDATE_FAILED,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async updatePostStatusById(
    id: string,
    payload: UpdatePostStatusDTO,
  ): Promise<IGetPostResponse> {
    try {
      const currentPost = await this.getPostById(id);
      if (!currentPost) {
        throw new ForbiddenException(errorMessages.UPDATE_POST_STATUS_FAILED, {
          cause: new Error(),
          description: errorCodes.ERR_POST_STATUS_UPDATE_FAILED,
        });
      }
      const dataUpdate: IUpdatePostStatusPayload = {
        status: payload.status,
      };

      const updatedResponse = await this.postsRepository
        .createQueryBuilder('posts')
        .update()
        .set(dataUpdate)
        .where('id = :id', { id })
        .returning('*')
        .execute();
      return updatedResponse.raw;
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async getListPosts(query: IGetListPostsQuery): Promise<IListPosts> {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;
    const totalCount = await this.postsRepository
      .createQueryBuilder('posts')
      .where(!status ? 'true' : 'posts.status = :status', { status })
      .getCount();
    const totalPages = Math.ceil(totalCount / limit);
    const posts = await this.postsRepository
      .createQueryBuilder('posts')
      .where(!status ? 'true' : 'posts.status = :status', { status })
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      posts: posts,
      pagination: {
        limit: limit,
        currentPage: page,
        count: posts.length,
        totalPages: totalPages,
      },
    };
  }
}
