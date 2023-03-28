import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';

import { IResponseBase } from '@interfaces/index';
import { BadRequestExceptionFilter } from '@utils/BadRequestExceptionFilter';

import AuthService from './auth.service';
import { LoginInfoDTO } from './dto/auth.dto';
import { IAuthResponse } from './auth.interface';
import TransformInterceptor from './auth.interceptor';

@UseInterceptors(TransformInterceptor)
@UseFilters(new BadRequestExceptionFilter())
@Controller({ path: 'login', version: ['1'] })
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
