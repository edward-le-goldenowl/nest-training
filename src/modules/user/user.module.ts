import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '@cloudinary/cloudinary.module';

import AccountEntity from './entities/account.entity';
import UserProfileEntity from './entities/userProfile.entity';

import UserController from './user.controller';
import UserService from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, UserProfileEntity]),
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
