import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IRequest } from '@interfaces/index';
import { errorMessages, errorCodes, roles } from '@constants/index';
import { CloudinaryService } from '@cloudinary/cloudinary.service';
import UserService from '@user/user.service';

import PostsEntity from './entities/posts.entity';
import {
  INewPostPayload,
  IGetPostResponse,
  IUpdatePostPayload,
} from './posts.interface';
import { AddNewPostDTO, UpdatePostDTO } from './dto/posts.dto';

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
        const uploadResponse = await this.cloudinary.uploadImage(file, folder);
        newPostPayload['previewImage'] = uploadResponse.secure_url;
      }
      const newPost = this.postsRepository.create(newPostPayload);
      const savedPost = await this.postsRepository.save(newPost);
      return savedPost;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          errorMessages.SOME_THING_WENT_WRONG,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async deletePostById(req: IRequest, id: string) {
    try {
      const user = req.user;
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          errorMessages.SOME_THING_WENT_WRONG,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          errorMessages.SOME_THING_WENT_WRONG,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
        const uploadResponse = await this.cloudinary.uploadImage(file, folder);
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          errorMessages.SOME_THING_WENT_WRONG,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
