import { Column, Entity, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import Posts from '@posts/entities/posts.entity';
import Comments from '@comments/entities/comments.entity';
import BaseEntity from '@common/entities/BaseEntity';
import CommentLikes from '@comments/entities/commentLikes.entity';

import UsersProfile from './usersProfile.entity';

@Entity()
class Account extends BaseEntity {
  @Column({ unique: true })
  public email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  public password: string;

  @Column()
  public usersProfileId: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'text', unique: true, nullable: true, select: false })
  public refreshToken!: string | null;

  @Column({ nullable: true })
  public role: string;

  @OneToOne(() => UsersProfile, (usersProfile) => usersProfile.account)
  @JoinColumn()
  usersProfile: UsersProfile;

  @OneToMany(() => Posts, (posts) => posts.author)
  posts: Posts[];

  @OneToMany(() => Comments, (comments) => comments.user)
  comments: Comments[];
  @OneToMany(() => CommentLikes, (likes) => likes.commentId)
  likes: CommentLikes[];
}

export default Account;
