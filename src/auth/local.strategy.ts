import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { IAccountQueryResponse } from '@user/user.interface';

import { AuthenticationService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(
    email: string,
    password: string,
  ): Promise<IAccountQueryResponse> {
    return this.authenticationService.getAuthenticatedUser(email, password);
  }
}
