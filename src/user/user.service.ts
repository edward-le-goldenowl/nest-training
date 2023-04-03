import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

import { errorMessages } from '@constants/messages';

import AccountEntity from './models/account.entity';
import UserProfileEntity from './models/userProfile.entity';
import {
  ISignUpData,
  IAccountData,
  IUserProfileData,
  ISignUpResponse,
} from './user.interface';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(UserProfileEntity)
    private userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  async getByEmail(email: string): Promise<UserProfileEntity | null> {
    const findOptions: FindOneOptions<UserProfileEntity> = {
      where: {
        email: email,
      },
    };
    const user = await this.userProfileRepository.findOne(findOptions);
    return user;
  }

  async create(signUpData: ISignUpData): Promise<ISignUpResponse> {
    try {
      const user = await this.getByEmail(signUpData.email);
      if (user) {
        throw new HttpException(
          errorMessages.EMAIL_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }
      const hashedPassword = await bcrypt.hash(signUpData.password, 10);
      const accountData: IAccountData = {
        id: uuidv4(),
        username: signUpData.username,
        password: hashedPassword,
      };
      const userProfileData: IUserProfileData = {
        id: uuidv4(),
        email: signUpData.email,
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
        username: savedAccount.username,
        email: savedUserProfile.email,
        fullName: savedUserProfile.fullName,
        dob: savedUserProfile.dob,
        createdAt: savedUserProfile.createdAt,
        updatedAt: savedUserProfile.updatedAt,
      };
    } catch (err) {
      console.error(err);
      if (err) throw err;
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }
  }
}
