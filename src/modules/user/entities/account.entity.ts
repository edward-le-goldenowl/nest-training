import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import Posts from '@posts/entities/posts.entity';

import UserProfile from './userProfile.entity';

@Entity()
class Account {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  public password: string;

  @Column()
  public userProfileId: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'text', unique: true, nullable: true, select: false })
  public refreshToken!: string | null;

  @Column({ nullable: true })
  public role: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.account)
  @JoinColumn()
  userProfile: UserProfile;

  @OneToMany(() => Posts, (posts) => posts.author)
  posts: Posts[];
}

export default Account;
