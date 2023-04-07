import {
  Req,
  Get,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { IResponseBase, IRequest } from '@interfaces/index';
import { successMessages } from '@constants/messages';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
  LocalAuthenticationGuard,
} from '@common/guards';

import { ICurrentUserResponse } from './auth.interface';
import { AuthenticationService } from './auth.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(
    @Req() req: IRequest,
  ): Promise<IResponseBase<ICurrentUserResponse>> {
    const response = await this.authService.login(req);
    return {
      data: response,
      message: successMessages.LOGIN_SUCCESSFULLY,
      errorCode: '',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@Req() req: IRequest): Promise<IResponseBase<null>> {
    await this.authService.logout(req);
    return {
      data: null,
      message: successMessages.LOGOUT_SUCCESSFULLY,
      errorCode: '',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req: IRequest,
  ): Promise<IResponseBase<ICurrentUserResponse>> {
    const response = await this.authService.refreshTokens(req);
    return {
      data: response,
      message: successMessages.SUCCESS,
      errorCode: '',
    };
  }
}
