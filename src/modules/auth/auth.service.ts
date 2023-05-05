import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import UserService from '@user/user.service';
import { IRequest } from '@interfaces';
import { IAccountQueryResponse } from '@user/user.interface';
import { errorMessages, errorCodes } from '@constants';
import CatchError from '@utils/catchError';

import { ICurrentUserResponse } from './auth.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async logout(req: IRequest) {
    try {
      const account = req.user;
      if (account) {
        const id = account['id'];
        req.res.setHeader('Set-Cookie', [
          `refresh_token=; HttpOnly; Path=/; Max-Age=0`,
        ]);
        return this.userService.removeRefreshTokenById(id);
      }
      throw new BadRequestException(errorMessages.TOKEN_NOT_FOUND, {
        cause: new Error(),
        description: errorCodes.ERR_LOG_OUT,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async login(req: IRequest): Promise<ICurrentUserResponse> {
    try {
      const account = req.user;
      if (account && account.usersProfileId) {
        const tokens = await this.getTokens(account.id, account.email);
        await this.userService.updateRefreshTokenById(
          account.id,
          tokens.refreshToken,
        );
        const refreshTokenCookie = `refresh_token=${
          tokens.refreshToken
        }; HttpOnly; Path=/; Max-Age=${
          this.configService.get('JWT_REFRESH_EXPIRATION_TIME') * 24 * 3600
        }`;
        req.res.setHeader('Set-Cookie', [refreshTokenCookie]);
        return {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };
      }
      throw new UnauthorizedException(errorMessages.LOGIN_FAILED, {
        cause: new Error(),
        description: errorCodes.ERR_LOGIN_FAILED,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async validateUser(
    email: string,
    plainTextPassword: string,
  ): Promise<IAccountQueryResponse> {
    try {
      const account = await this.userService.getAccountByEmail(email);
      if (account && account.password) {
        const isPasswordMatching = await this.verifyPassword(
          plainTextPassword,
          account.password,
        );
        if (!isPasswordMatching)
          throw new UnauthorizedException(errorMessages.LOGIN_FAILED, {
            cause: new Error(),
            description: errorCodes.ERR_LOGIN_FAILED,
          });
        delete account.password;
        return account;
      }
      throw new UnauthorizedException(errorMessages.LOGIN_FAILED, {
        cause: new Error(),
        description: errorCodes.ERR_LOGIN_FAILED,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  public async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    return isPasswordMatching;
  }

  public async getTokens(id: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: `${this.configService.get<string>(
            'JWT_ACCESS_EXPIRATION_TIME',
          )}m`,
        },
      ),
      this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: `${this.configService.get<string>(
            'JWT_REFRESH_EXPIRATION_TIME',
          )}d`,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    req: IRequest,
  ): Promise<ICurrentUserResponse | undefined> {
    try {
      const account = req.user;
      if (account) {
        const id = account['id'];
        const refreshToken = account['refreshToken'];
        const user = await this.userService.getAccountById(id);
        if (!user || !user.refreshToken)
          throw new ForbiddenException(errorMessages.ACCESS_DENIED, {
            cause: new Error(),
            description: errorCodes.ERR_REFRESH_TOKEN,
          });
        const refreshTokenMatches = await bcrypt.compare(
          refreshToken,
          user.refreshToken,
        );
        if (!refreshTokenMatches)
          throw new ForbiddenException(errorMessages.ACCESS_DENIED, {
            cause: new Error(),
            description: errorCodes.ERR_REFRESH_TOKEN,
          });
        const tokens = await this.getTokens(user.id, user.email);
        await this.userService.updateRefreshTokenById(
          user.id,
          tokens.refreshToken,
        );
        return tokens;
      }
      throw new ForbiddenException(errorMessages.ACCESS_DENIED, {
        cause: new Error(),
        description: errorCodes.ERR_REFRESH_TOKEN,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }
}
