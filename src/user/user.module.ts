import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AccountEntity from './models/account.entity';
import UserProfileEntity from './models/userProfile.entity';

import UserController from './user.controller';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, UserProfileEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
