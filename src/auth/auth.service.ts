import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILoginData, IAuthResponse } from './auth.interface';
import { LoginInfoDTO } from './dto/auth.dto';

@Injectable()
export default class AuthService {
  private loginDataMocked: ILoginData = {
    username: 'dungle',
    password: '111',
  };

  login(loginInfo: LoginInfoDTO) {
    if (
      loginInfo.username === this.loginDataMocked.username &&
      loginInfo.password === this.loginDataMocked.password
    ) {
      const response: IAuthResponse = {
        name: 'Dung Le',
        dob: '1998-12-29',
        gender: 'M',
      };
      return response;
    }
    throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
  }
}
