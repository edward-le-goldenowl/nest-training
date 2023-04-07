import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { errorMessages } from '@constants/messages';

import AccountEntity from './entities/account.entity';
import UserProfileEntity from './entities/userProfile.entity';
import {
  IRegisterData,
  IAccountData,
  IUserProfileData,
  IRegisterResponse,
  IAccountQueryResponse,
  IUserProfileResponse,
} from './user.interface';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(UserProfileEntity)
    private userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  public async getUserProfileById(id: string): Promise<IUserProfileResponse> {
    try {
      const response = await this.accountRepository
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.userProfile', 'userProfile')
        .select([
          'account.id AS id',
          'account.email AS email',
          'account.refreshToken AS "refreshToken"',
          'userProfile.fullName AS "fullName"',
          'userProfile.dob AS dob',
          'userProfile.createdAt AS "createdAt"',
          'userProfile.updatedAt AS "updatedAt"',
        ])
        .where('account.id = :id', { id })
        .getRawOne();
      if (response) return response;
      throw new HttpException(
        errorMessages.NOT_FOUND_USER,
        HttpStatus.NOT_FOUND,
      );
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
    const findOptions: FindOneOptions<IAccountQueryResponse> = {
      where: {
        email: email,
      },
    };
    const user = await this.accountRepository.findOne(findOptions);
    return user;
  }

  public async create(registerData: IRegisterData): Promise<IRegisterResponse> {
    try {
      const user = await this.getAccountByEmail(registerData.email);
      if (user) {
        throw new HttpException(
          errorMessages.EMAIL_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }
      const hashedPassword = await bcrypt.hash(registerData.password, 10);
      const accountData: IAccountData = {
        email: registerData.email,
        password: hashedPassword,
      };
      const userProfileData: IUserProfileData = {
        fullName: registerData.fullName,
        dob: registerData.dob,
      };
      const newUserProfile = this.userProfileRepository.create(userProfileData);
      const savedUserProfile = await this.userProfileRepository.save(
        newUserProfile,
      );
      const newUserAccount = this.accountRepository.create({
        ...accountData,
        userProfileId: savedUserProfile.id,
      });
      const savedAccount = await this.accountRepository.save(newUserAccount);
      return {
        id: savedAccount.id,
      };
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

  public async updateRefreshTokenByid(
    id: string,
    refreshToken: string,
  ): Promise<string> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.accountRepository.update(id, { refreshToken: hashedToken });
    return refreshToken;
  }

  public async removeRefreshTokenByid(id: string): Promise<string> {
    await this.accountRepository.update(id, { refreshToken: '' });
    return id;
  }
}
