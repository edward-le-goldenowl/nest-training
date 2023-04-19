import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CloudinaryService } from '@cloudinary/cloudinary.service';

import PostsEntity from '@posts/entities/posts.entity';

import UserService from '../user.service';
import AccountEntity from '../entities/account.entity';
import UserProfileEntity from '../entities/userProfile.entity';

// Mock dependency
jest.mock('@cloudinary/cloudinary.service');
jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;
  const newMockAccount = {
    email: 'example@example.com',
    password: 'password',
    role: 'user',
    userProfileId: '12345',
  };
  const newMockUserProfile = {
    id: '12345',
    fullName: 'John Doe',
    dob: new Date(),
  };

  const mockAccountRepository = {
    create: jest.fn().mockReturnValue(newMockAccount),
    save: jest
      .fn()
      .mockReturnValue(Promise.resolve({ ...newMockAccount, id: 'abcde' })),
    findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      withDeleted: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValueOnce(null),
    })),
  };

  const mockUserProfileRepository = {
    create: jest.fn().mockReturnValue(newMockUserProfile),
    save: jest.fn().mockReturnValue(Promise.resolve(newMockUserProfile)),
  };

  const mockPostRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(AccountEntity),
          useValue: mockAccountRepository,
        },
        {
          provide: getRepositoryToken(UserProfileEntity),
          useValue: mockUserProfileRepository,
        },
        {
          provide: getRepositoryToken(PostsEntity),
          useValue: mockPostRepository,
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadImage: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an account and profile successfully', async () => {
      const registerData = {
        email: 'example@example.com',
        password: 'password',
        role: 'user',
        fullName: 'John Doe',
        dob: new Date(),
      };

      //   jest
      //     .spyOn(bcrypt, 'hash')
      //     .mockImplementation(() => Promise.resolve('hashedPassword'));
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashedPassword'));

      // Create new account
      mockUserProfileRepository.create.mockImplementationOnce(
        () => newMockUserProfile,
      );
      await userService.create(registerData);

      // Check that new user profile is created properly.
      expect(mockUserProfileRepository.create).toHaveBeenCalledWith({
        fullName: registerData.fullName,
        dob: registerData.dob,
      });

      // Check that the newly created user profile has been saved.
      expect(mockUserProfileRepository.save).toHaveBeenCalledWith(
        newMockUserProfile,
      );

      // Check that bcrypt hash function is called
      expect(bcrypt.hash).toHaveBeenCalledWith(registerData.password, 10);

      // Check that new user account is created with hashed password and profile ID.
      expect(mockAccountRepository.create).toHaveBeenCalledWith({
        ...newMockAccount,
        password: 'hashedPassword',
      });

      // Check that the newly created account has been saved.
      //   expect(mockAccountRepository.save).toHaveBeenCalledWith({
      //     ...newMockAccount,
      //     password: 'hashedPassword',
      //   });
    });
  });
});
