import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import User from '@user/entities/account.entity';
import BaseEntity from '@common/entities/BaseEntity';
import Post from '@posts/entities/posts.entity';

import CommentLikes from './commentLikes.entity';

@Entity()
class Comments extends BaseEntity {
  @Column()
  public content: string;

  @Column()
  public userId: string;

  @Column()
  public postId: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @OneToMany(() => CommentLikes, (likes) => likes.commentId)
  likes: CommentLikes[];
}

export default Comments;
