import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@user/user.module';
import { PostsModule } from '@posts/posts.module';

import CommentsEntity from './entities/comments.entity';
import CommentLikesEntity from './entities/commentLikes.entity';
import CommentsController from './comments.controller';
import CommentsService from './comments.service';

@Module({
  imports: [
    UserModule,
    PostsModule,
    TypeOrmModule.forFeature([CommentsEntity, CommentLikesEntity]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
