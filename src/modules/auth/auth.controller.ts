/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Req,
  Get,
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { IResponseBase, IRequest } from '@interfaces';
import { successMessages } from '@constants';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
  LocalAuthenticationGuard,
} from '@common/guards';

import { ICurrentUserResponse } from './auth.interface';
import { AuthenticationService } from './auth.service';
import { LoginDTO } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @UseGuards(LocalAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  @ApiOkResponse({ description: 'Login' })
  @ApiBody({ type: LoginDTO })
  async login(
    @Req() req: IRequest,
  ): Promise<IResponseBase<ICurrentUserResponse>> {
    const response = await this.authService.login(req);
    return {
      data: response,
      message: successMessages.SUCCESS,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @ApiOkResponse({ description: 'Logout' })
  async logout(@Req() req: IRequest): Promise<IResponseBase<null>> {
    await this.authService.logout(req);
    return {
      data: null,
      message: successMessages.SUCCESS,
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiOkResponse({ description: 'Get new tokens' })
  async refreshTokens(
    @Req() req: IRequest,
  ): Promise<IResponseBase<ICurrentUserResponse>> {
    const response = await this.authService.refreshTokens(req);
    return {
      data: response,
      message: successMessages.SUCCESS,
    };
  }
}
