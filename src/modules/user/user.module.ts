import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import PostsEntity from '@posts/entities/posts.entity';
import { CloudinaryModule } from '@cloudinary/cloudinary.module';

import AccountEntity from './entities/account.entity';
import UserProfileEntity from './entities/userProfile.entity';

import UserController from './user.controller';
import UserService from './user.service';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([AccountEntity, UserProfileEntity, PostsEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
