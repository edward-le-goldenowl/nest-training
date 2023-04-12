import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { IRequest } from '@interfaces/index';
import { errorCodes, errorMessages } from '@constants/index';
import PostsEntity from '@posts/entities/posts.entity';
import { CloudinaryService } from '@cloudinary/cloudinary.service';

import AccountEntity from './entities/account.entity';
import UserProfileEntity from './entities/userProfile.entity';
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
    @InjectRepository(UserProfileEntity)
    private userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(PostsEntity)
    private postsRepository: Repository<PostsEntity>,
    private cloudinary: CloudinaryService,
  ) {}

  public async updateUserProfile(
    req: IRequest,
    file: Express.Multer.File,
    payload: IUpdateUserProfilePayload,
  ) {
    try {
      const user = req.user;
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
        const uploadResponse = await this.cloudinary.uploadImage(file, folder);
        dataUpdate['avatar'] = uploadResponse.secure_url;
      }
      const updatedResponse = await this.userProfileRepository
        .createQueryBuilder('userProfile')
        .update()
        .set(dataUpdate)
        .where('id = :id', { id: account.userProfileId })
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

      await this.userProfileRepository
        .createQueryBuilder('userProfile')
        .softDelete()
        .where('id = :id', { id: account.userProfileId })
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

  public async getUserProfileById(id: string): Promise<IUserProfileResponse> {
    try {
      const response = await this.accountRepository
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.userProfile', 'userProfile')
        .select([
          'account.id AS id',
          'account.email AS email',
          'account.role AS role',
          'userProfile.fullName AS "fullName"',
          'userProfile.dob AS dob',
          'userProfile.avatar AS avatar',
          'userProfile.phone AS phone',
          'userProfile.address AS address',
          'userProfile.createdAt AS "createdAt"',
          'userProfile.updatedAt AS "updatedAt"',
        ])
        .where('account.id = :id', { id })
        .getRawOne();
      if (response) return response;
      throw new NotFoundException(errorMessages.NOT_FOUND_USER, {
        cause: new Error(),
        description: errorCodes.ERR_USER_NOT_FOUND,
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
      const userProfilePayload: IUserProfilePayload = {
        fullName: registerData.fullName,
        dob: registerData.dob,
      };
      const newUserProfile =
        this.userProfileRepository.create(userProfilePayload);
      const savedUserProfile = await this.userProfileRepository.save(
        newUserProfile,
      );
      const newUserAccount = this.accountRepository.create({
        ...accountPayload,
        userProfileId: savedUserProfile.id,
      });
      const savedAccount = await this.accountRepository.save(newUserAccount);
      return savedAccount;
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
