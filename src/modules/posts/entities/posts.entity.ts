import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import User from '@user/entities/account.entity';
import Comments from '@comments/entities/comments.entity';
import BaseEntity from '@common/entities/BaseEntity';

@Entity()
class Posts extends BaseEntity {
  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column()
  public authorId: string;

  @Column({ nullable: true })
  public previewImage: string;

  @Column({ default: 'pending' })
  public status: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @OneToMany(() => Comments, (comments) => comments.post)
  comments: Comments[];
}

export default Posts;
