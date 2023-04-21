import { Column, Entity, ManyToOne } from 'typeorm';

import User from '@user/entities/account.entity';
import BaseEntity from '@common/entities/BaseEntity';

import Comments from './comments.entity';

@Entity()
class CommentLikes extends BaseEntity {
  @Column()
  public userId: string;

  @Column()
  public commentId: string;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToOne(() => Comments, (comment) => comment.likes)
  comment: Comments;
}

export default CommentLikes;
