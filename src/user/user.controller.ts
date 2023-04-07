import {
  Body,
  Req,
  Controller,
  Post,
  Get,
  HttpCode,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

import { IResponseBase, IRequest } from '@interfaces/index';
import { successMessages } from '@constants/messages';
import { AccessTokenGuard } from '@common/guards';

import { RegisterDTO } from './dto/user.dto';
import { IRegisterResponse, IUserProfileResponse } from './user.interface';
import UserService from './user.service';

@Controller({ path: 'user', version: ['1'] })
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(['/register'])
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() payload: RegisterDTO,
  ): Promise<IResponseBase<{ user: IRegisterResponse }>> {
    const response = await this.userService.create(payload);
    return {
      data: { user: response },
      message: successMessages.REGISTER_SUCCESSFULLY,
      errorCode: '',
    };
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get(['/me'])
  async signUp(
    @Req() req: IRequest,
  ): Promise<IResponseBase<{ user: IUserProfileResponse }>> {
    const id = req.user['id'];
    const response = await this.userService.getUserProfileById(id);
    return {
      data: { user: response },
      message: successMessages.SUCCESS,
      errorCode: '',
    };
  }
}
