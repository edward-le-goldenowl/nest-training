import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';

import { IResponseBase } from '@interfaces/index';
import { SignUpDTO } from './dto/user.dto';
import { ISignUpResponse } from './user.interface';
import UserService from './user.service';

@Controller({ path: 'user', version: ['1'] })
export default class UserController {
  constructor(private readonly userService: UserService) {}
  @Post(['/sign-up'])
  @HttpCode(HttpStatus.OK)
  async signUp(
    @Body() signUpInfo: SignUpDTO,
  ): Promise<IResponseBase<ISignUpResponse>> {
    const response = await this.userService.signUp(signUpInfo);
    return { data: { user: response }, message: 'SUCCESS', errorCode: '' };
  }
}
