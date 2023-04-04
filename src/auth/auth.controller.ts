import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

import { IResponseBase } from '@interfaces/index';
import { successMessages } from '@constants/messages';

import { ILoginData, ILoginResponse } from './auth.interface';
import { AuthenticationService } from './auth.service';
import { LocalAuthenticationGuard } from './localAuthentication.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(
    @Body() loginData: ILoginData,
  ): Promise<IResponseBase<{ user: ILoginResponse }>> {
    const response = await this.authenticationService.getAuthenticatedUser(
      loginData.email,
      loginData.password,
    );
    return {
      data: { user: response },
      message: successMessages.LOGIN_SUCCESSFULLY,
      errorCode: '',
    };
  }
}
