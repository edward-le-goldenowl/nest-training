import {
  Body,
  Req,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  HttpCode,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { IResponseBase, IRequest } from '@interfaces/index';
import { successMessages } from '@constants/messages';
import { AccessTokenGuard, RolesGuard } from '@common/guards';
import { Roles } from '@common/guards/roles.decorator';

import { RegisterDTO } from './dto/user.dto';
import { IRegisterResponse, IUserProfileResponse } from './user.interface';
import UserService from './user.service';

@Controller({ path: 'user', version: ['1'] })
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(['/register'])
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() payload: RegisterDTO,
  ): Promise<IResponseBase<{ user: IRegisterResponse }>> {
    const response = await this.userService.create(payload);
    return {
      data: { user: response },
      message: successMessages.SUCCESS,
      error: '',
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get(['/me'])
  async getProfile(
    @Req() req: IRequest,
  ): Promise<IResponseBase<{ user: IUserProfileResponse }>> {
    const id = req.user['id'];
    const response = await this.userService.getUserProfileById(id);
    return {
      data: { user: response },
      message: successMessages.SUCCESS,
      error: '',
    };
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(['/delete/:id'])
  @Roles('admin')
  async deleteUser(@Param('id') id: string): Promise<IResponseBase<null>> {
    await this.userService.deleteAccountById(id);
    return {
      data: null,
      message: successMessages.SUCCESS,
      error: '',
    };
  }
}
