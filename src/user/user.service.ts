import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { errorMessages } from '@constants/messages';

import AccountEntity from './models/account.entity';
import UserProfileEntity from './models/userProfile.entity';
import {
  IRegisterData,
  IAccountData,
  IUserProfileData,
  IRegisterResponse,
  IAccountQueryResponse,
  IUserProfileQueryResponse,
} from './user.interface';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(UserProfileEntity)
    private userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  public async getUserProfileById(
    id: string,
  ): Promise<IUserProfileQueryResponse | null> {
    const findOptions: FindOneOptions<IUserProfileQueryResponse> = {
      where: {
        id: id,
      },
    };
    const user = await this.userProfileRepository.findOne(findOptions);
    return user;
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

  public async create(signUpData: IRegisterData): Promise<IRegisterResponse> {
    try {
      const user = await this.getAccountByEmail(signUpData.email);
      if (user) {
        throw new HttpException(
          errorMessages.EMAIL_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }
      const hashedPassword = await bcrypt.hash(signUpData.password, 10);
      const accountData: IAccountData = {
        email: signUpData.email,
        password: hashedPassword,
      };
      const userProfileData: IUserProfileData = {
        fullName: signUpData.fullName,
        dob: signUpData.dob,
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
        email: savedAccount.email,
        fullName: savedUserProfile.fullName,
        dob: savedUserProfile.dob,
        createdAt: savedUserProfile.createdAt,
        updatedAt: savedUserProfile.updatedAt,
      };
    } catch (err) {
      console.error(err);
      if (err) throw err;
      throw new HttpException(
        errorMessages.REGISTER_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
