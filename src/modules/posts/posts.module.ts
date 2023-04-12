import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@user/user.module';
import { CloudinaryModule } from '@cloudinary/cloudinary.module';

import PostsEntity from './entities/posts.entity';

import PostsController from './posts.controller';
import PostsService from './posts.service';

@Module({
  imports: [
    UserModule,
    CloudinaryModule,
    TypeOrmModule.forFeature([PostsEntity]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
