import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import AccountEntity from './models/account.entity';
import UserProfileEntity from './models/userProfile.entity';

import { ISignUpData, IAccountData, IUserProfileData } from './user.interface';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(UserProfileEntity)
    private userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  async signUp(signUpData: ISignUpData): Promise<IAccountData> {
    try {
      const accountData: IAccountData = {
        id: uuidv4(),
        username: signUpData.username,
        password: signUpData.password,
      };
      const userProfileData: IUserProfileData = {
        id: uuidv4(),
        email: signUpData.email,
        fullName: signUpData.fullName,
        dob: signUpData.dob,
      };
      const savedUserProfile = await this.userProfileRepository.save(
        userProfileData,
      );
      console.log(
        '🚀 ~ file: user.service.ts:36 ~ UserService ~ signUp ~ savedUserProfile:',
        savedUserProfile,
      );
      await this.accountRepository.save({
        ...accountData,
        userProfileId: savedUserProfile.id,
      });
      return {
        id: '1',
        username: signUpData.username,
        password: signUpData.password,
      };
    } catch (err) {
      console.log(
        '🚀 ~ file: user.service.ts:46 ~ UserService ~ signUp ~ err:',
        err,
      );
      throw new HttpException('Sign up failed', HttpStatus.UNAUTHORIZED);
    }
  }
}
