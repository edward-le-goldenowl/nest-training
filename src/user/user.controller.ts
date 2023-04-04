import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';

import { IResponseBase } from '@interfaces/index';
import { successMessages } from '@constants/messages';

import { RegisterDTO } from './dto/user.dto';
import { IRegisterResponse } from './user.interface';
import UserService from './user.service';

@Controller({ path: 'user', version: ['1'] })
export default class UserController {
  constructor(private readonly userService: UserService) {}
  @Post(['/register'])
  @HttpCode(HttpStatus.OK)
  async signUp(
    @Body() registerData: RegisterDTO,
  ): Promise<IResponseBase<{ user: IRegisterResponse }>> {
    const response = await this.userService.create(registerData);
    return {
      data: { user: response },
      message: successMessages.REGISTER_SUCCESSFULLY,
      errorCode: '',
    };
  }
}
