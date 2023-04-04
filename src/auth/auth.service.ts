import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { errorMessages } from '@constants/messages';
import UserService from '@user/user.service';

import { ILoginResponse } from './auth.interface';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userService: UserService) {}

  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<ILoginResponse> {
    try {
      const account = await this.userService.getAccountByEmail(email);
      if (account && account.password) {
        await this.verifyPassword(plainTextPassword, account.password);
        const userProfile = await this.userService.getUserProfileById(
          account.userProfileId,
        );
        if (userProfile)
          return {
            id: account.id,
            userProfileId: account.userProfileId,
            email: account.email,
            fullName: userProfile.fullName,
            dob: userProfile.dob,
            createdAt: userProfile.createdAt,
            updatedAt: userProfile.updatedAt,
          };
      }
      throw new HttpException(
        errorMessages.LOGIN_FAILED,
        HttpStatus.UNAUTHORIZED,
      );
    } catch (error) {
      throw new HttpException(
        errorMessages.LOGIN_FAILED,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        errorMessages.LOGIN_FAILED,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
