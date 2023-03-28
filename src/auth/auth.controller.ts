import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';

import { IResponseBase } from '@interfaces/index';

import AuthService from './auth.service';
import { LoginInfoDTO } from './dto/auth.dto';
import TransformInterceptor from './auth.interceptor';
import { IAuthResponse } from './auth.interface';

@UseInterceptors(TransformInterceptor)
@Controller('login')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginInfo: LoginInfoDTO,
  ): Promise<IResponseBase<IAuthResponse>> {
    const data: IAuthResponse = this.authService.login(loginInfo);
    return { data, message: 'SUCCESS', errorCode: '' };
  }
}
