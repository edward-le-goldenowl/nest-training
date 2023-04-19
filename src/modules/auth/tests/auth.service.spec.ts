/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

import UserService from '@user/user.service';
import { IRequest } from '@interfaces/request.interface';
import { errorMessages, errorCodes } from '@constants/index';

import { AuthenticationService } from '../auth.service';

jest.mock('bcrypt');

const mockJwtService = {
  signAsync: jest.fn().mockImplementation(() => Promise.resolve('mock')),
};
const mockConfigService = {
  // Define mock config service
  get: jest.fn(),
};

const mockUserService = {
  updateRefreshTokenById: jest.fn(),
  removeRefreshTokenById: jest.fn(),
  getAccountByEmail: jest.fn(),
  getAccountById: jest.fn(),
};

const baseMockUser = {
  id: 'mock_user_id',
  refreshToken: 'mock_refresh_token',
  accessToken: 'mock_access_token',
  email: 'test@example.com',
  userProfileId: 'mock_user_profile_id',
  password: 'mock_password',
};

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let configService: ConfigService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    authService = module.get<AuthenticationService>(AuthenticationService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  describe('logout method', () => {
    it('should logout user successfully', async () => {
      const mockRequest: IRequest = {
        user: baseMockUser,
        res: {
          setHeader: jest.fn(),
        },
      };

      await expect(authService.logout(mockRequest)).resolves.toBeFalsy();
      expect(mockRequest.res.setHeader).toHaveBeenCalledWith('Set-Cookie', [
        `refresh_token=; HttpOnly; Path=/; Max-Age=0`,
      ]);
      expect(userService.removeRefreshTokenById).toHaveBeenCalledWith(
        baseMockUser.id,
      );
    });

    it('should throw BadRequestException when user is not logged in', async () => {
      const mockRequest: IRequest = {
        user: undefined,
        res: {
          setHeader: jest.fn(),
        },
      };

      await expect(authService.logout(mockRequest)).rejects.toThrow(
        BadRequestException,
      );
      expect(userService.removeRefreshTokenById).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if an unexpected error occurs', async () => {
      const mockRequest = {
        user: baseMockUser,
        res: {
          setHeader: jest.fn().mockImplementation(() => {
            throw new Error('Mock error');
          }),
        },
      };

      await expect(authService.logout(mockRequest)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(userService.removeRefreshTokenById).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return current user with access token and refresh token in response cookies', async () => {
      const mockTokens = {
        refreshToken: 'mock_refresh_token',
        accessToken: 'mock_access_token',
      };

      jest
        .spyOn(userService, 'updateRefreshTokenById')
        .mockImplementation(async (): Promise<string> => {
          return mockTokens.refreshToken;
        });

      // Mocking jwtService.signAsync method to return pre-defined tokens
      jest
        .spyOn(authService['jwtService'], 'signAsync')
        .mockResolvedValueOnce(mockTokens.accessToken)
        .mockResolvedValueOnce(mockTokens.refreshToken);

      const mockReq = { user: baseMockUser, res: { setHeader: jest.fn() } };
      const expectedTokens = {
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
      };

      jest
        .spyOn(authService, 'getTokens')
        .mockResolvedValueOnce(expectedTokens);
      jest
        .spyOn(userService, 'updateRefreshTokenById')
        .mockResolvedValueOnce('refresh token updated');
      mockConfigService.get.mockReturnValueOnce(30); // Set JWT_REFRESH_EXPIRATION_TIME to 30 days
      const result = await authService.login(mockReq);
      expect(result).toEqual(expectedTokens);
      const maxAgeInSeconds = 30 * 24 * 3600;
      expect(mockReq.res.setHeader).toHaveBeenCalledWith('Set-Cookie', [
        `refresh_token=${expectedTokens.refreshToken}; HttpOnly; Path=/; Max-Age=${maxAgeInSeconds}`,
      ]);
      expect(authService.getTokens).toHaveBeenCalledWith(
        mockReq.user.id,
        mockReq.user.email,
      );
    });
    it('should throw UnauthorizedException if account does not exist with userProfileId', async () => {
      const mockReq = {
        user: undefined,
        res: {
          setHeader: jest.fn(),
        },
      };
      await expect(authService.login(mockReq)).rejects.toThrowError(
        new UnauthorizedException(errorMessages.LOGIN_FAILED, {
          cause: new Error(),
          description: errorCodes.ERR_LOGIN_FAILED,
        }),
      );
      expect(mockReq.res.setHeader).not.toHaveBeenCalled();
      expect(userService.updateRefreshTokenById).not.toHaveBeenCalled();
    });
  });

  describe('validateUserPassword', () => {
    const hashedPassword =
      '$2b1010O5GyyELJiftug70kb2yHdO5f0JhWTzKf.R3qXZ.w39HtRoWW1NO92';
    it('should return true if passwords match', async () => {
      const password = 'password';
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      const result = await authService.verifyPassword(password, hashedPassword);
      expect(result).toEqual(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
    it('should return false if passwords do not match', async () => {
      const password = 'password';
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));
      const result = await authService.verifyPassword(password, hashedPassword);
      expect(result).toEqual(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });
});
