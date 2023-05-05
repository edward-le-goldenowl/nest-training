import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { IRequest } from '@interfaces';
import { errorCodes, errorMessages } from '@constants';
import PostsEntity from '@posts/entities/posts.entity';
import CommentsEntity from '@comments/entities/comments.entity';
import { CloudinaryService } from '@cloudinary/cloudinary.service';
import CatchError from '@utils/catchError';

import AccountEntity from './entities/account.entity';
import UsersProfileEntity from './entities/usersProfile.entity';
import {
  IRegisterPayload,
  IAccountPayload,
  IUserProfilePayload,
  IRegisterResponse,
  IAccountQueryResponse,
  IUserProfileResponse,
  IUpdateUserProfilePayload,
} from './user.interface';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(UsersProfileEntity)
    private usersProfileRepository: Repository<UsersProfileEntity>,
    @InjectRepository(PostsEntity)
    private postsRepository: Repository<PostsEntity>,
    @InjectRepository(CommentsEntity)
    private commentsRepository: Repository<CommentsEntity>,
    private cloudinary: CloudinaryService,
  ) {}

  public async updateUserProfile(
    req: IRequest,
    file: Express.Multer.File,
    payload: IUpdateUserProfilePayload,
  ) {
    try {
      const user = req.user;
      if (user) {
        const id = user['id'];
        const account = await this.getAccountById(id);
        if (!account)
          throw new ForbiddenException(errorMessages.ACCESS_DENIED, {
            cause: new Error(),
            description: errorCodes.ERR_UPLOAD_FILE_FAILED,
          });

        const dataUpdate: IUpdateUserProfilePayload = {
          fullName: payload.fullName,
          dob: payload.dob,
          address: payload.address,
          phone: payload.phone,
        };
        if (file) {
          const folder = 'user_profile';
          const uploadResponse = await this.cloudinary.uploadImage(
            file,
            folder,
          );
          dataUpdate['avatar'] = uploadResponse.secure_url;
        }
        const updatedResponse = await this.usersProfileRepository
          .createQueryBuilder('usersProfile')
          .update()
          .set(dataUpdate)
          .where('id = :id', { id: account.usersProfileId })
          .returning('*')
          .execute();
        return updatedResponse.raw;
      }
      throw new ForbiddenException(errorMessages.ACCESS_DENIED, {
        cause: new Error(),
        description: errorCodes.ERR_UPLOAD_FILE_FAILED,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async deleteAccountById(id: string) {
    try {
      const account = await this.accountRepository
        .createQueryBuilder('account')
        .where('account.id = :id', { id })
        .getOne();
      if (!account)
        throw new NotFoundException(errorMessages.NOT_FOUND_USER, {
          cause: new Error(),
          description: errorCodes.ERR_USER_NOT_FOUND,
        });

      await this.commentsRepository
        .createQueryBuilder('comments')
        .softDelete()
        .where('userId = :id', { id: account.id })
        .execute();

      await this.postsRepository
        .createQueryBuilder('posts')
        .softDelete()
        .where('authorId = :id', { id: account.id })
        .execute();

      await this.accountRepository
        .createQueryBuilder('account')
        .softDelete()
        .where('id = :id', { id })
        .execute();

      await this.usersProfileRepository
        .createQueryBuilder('usersProfile')
        .softDelete()
        .where('id = :id', { id: account.usersProfileId })
        .execute();
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async getUserProfileById(id: string): Promise<IUserProfileResponse> {
    try {
      const response = await this.accountRepository
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.usersProfile', 'usersProfile')
        .select([
          'account.id AS id',
          'account.email AS email',
          'account.role AS role',
          'usersProfile.fullName AS "fullName"',
          'usersProfile.dob AS dob',
          'usersProfile.avatar AS avatar',
          'usersProfile.phone AS phone',
          'usersProfile.address AS address',
          'usersProfile.createdAt AS "createdAt"',
          'usersProfile.updatedAt AS "updatedAt"',
        ])
        .where('account.id = :id', { id })
        .getRawOne();
      if (response) return response;
      throw new NotFoundException(errorMessages.NOT_FOUND_USER, {
        cause: new Error(),
        description: errorCodes.ERR_USER_NOT_FOUND,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async getAccountByEmail(
    email: string,
  ): Promise<IAccountQueryResponse | null> {
    const response = await this.accountRepository
      .createQueryBuilder('account')
      .addSelect(['account.password'])
      .where('account.email = :email', { email })
      .getOne();
    return response;
  }

  public async getAccountById(
    id: string,
  ): Promise<IAccountQueryResponse | null> {
    const response = await this.accountRepository
      .createQueryBuilder('account')
      .addSelect(['account.refreshToken'])
      .where('account.id = :id', { id })
      .getOne();
    return response;
  }

  public async findExistingAccountByEmail(
    email: string,
  ): Promise<IAccountQueryResponse | null> {
    const response = await this.accountRepository
      .createQueryBuilder('account')
      .where('account.email = :email', { email })
      .withDeleted()
      .getOne();
    return response;
  }

  public async create(
    registerData: IRegisterPayload,
  ): Promise<IRegisterResponse> {
    try {
      const user = await this.findExistingAccountByEmail(registerData.email);
      if (user) {
        throw new ConflictException(errorMessages.EMAIL_ALREADY_EXISTS, {
          cause: new Error(),
          description: errorCodes.ERR_EMAIL_ALREADY_EXIST,
        });
      }
      const hashedPassword = await bcrypt.hash(registerData.password, 10);
      const accountPayload: IAccountPayload = {
        email: registerData.email,
        password: hashedPassword,
        role: registerData.role,
      };
      const usersProfilePayload: IUserProfilePayload = {
        fullName: registerData.fullName,
        dob: registerData.dob,
      };
      const newUserProfile =
        this.usersProfileRepository.create(usersProfilePayload);
      const savedUserProfile = await this.usersProfileRepository.save(
        newUserProfile,
      );
      const newUserAccount = this.accountRepository.create({
        ...accountPayload,
        usersProfileId: savedUserProfile.id,
      });
      const savedAccount = await this.accountRepository.save(newUserAccount);
      return savedAccount;
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async updateRefreshTokenById(
    id: string,
    refreshToken: string,
  ): Promise<string> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.accountRepository.update(id, { refreshToken: hashedToken });
    return refreshToken;
  }

  public async removeRefreshTokenById(id: string): Promise<string> {
    await this.accountRepository.update(id, { refreshToken: null });
    return id;
  }
}
