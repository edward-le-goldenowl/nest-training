import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import UserService from '@user/user.service';
import { errorMessages } from '@constants/messages';
import { IRequest } from '@interfaces/index';
import { IAccountQueryResponse } from '@user/user.interface';

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
      const user = req.user;
      if (user) {
        const id = user['id'];
        req.res.setHeader('Set-Cookie', [
          `refresh_token=; HttpOnly; Path=/; Max-Age=0`,
        ]);
        return this.userService.removeRefreshTokenById(id);
      }
      throw new HttpException(
        errorMessages.TOKEN_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          errorMessages.SOME_THING_WENT_WRONG,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async login(req: IRequest): Promise<ICurrentUserResponse> {
    try {
      const account = req.user;
      if (account && account.userProfileId) {
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
      throw new HttpException(
        errorMessages.LOGIN_FAILED,
        HttpStatus.UNAUTHORIZED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          errorMessages.SOME_THING_WENT_WRONG,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async validateUser(
    email: string,
    plainTextPassword: string,
  ): Promise<IAccountQueryResponse> {
    try {
      const account = await this.userService.getAccountByEmail(email);
      if (account && account.password) {
        await this.verifyPassword(plainTextPassword, account.password);
        delete account.password;
        return account;
      }
      throw new HttpException(
        errorMessages.LOGIN_FAILED,
        HttpStatus.UNAUTHORIZED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          errorMessages.SOME_THING_WENT_WRONG,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        errorMessages.LOGIN_FAILED,
        HttpStatus.UNAUTHORIZED,
      );
    }
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
      const id = req.user['id'];
      const refreshToken = req.user['refreshToken'];
      const user = await this.userService.getAccountById(id);
      if (!user || !user.refreshToken)
        throw new HttpException(
          errorMessages.ACCESS_DENIED,
          HttpStatus.FORBIDDEN,
        );
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!refreshTokenMatches)
        throw new HttpException(
          errorMessages.ACCESS_DENIED,
          HttpStatus.FORBIDDEN,
        );
      const tokens = await this.getTokens(user.id, user.email);
      await this.userService.updateRefreshTokenById(
        user.id,
        tokens.refreshToken,
      );
      return tokens;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          errorMessages.SOME_THING_WENT_WRONG,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
