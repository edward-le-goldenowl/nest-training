import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  BeforeUpdate,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

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
  refreshToken!: string | null;

  @Column({ nullable: true })
  role: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @BeforeUpdate()
  updateTimestamps() {
    this.updatedAt = new Date();
  }

  @OneToOne(() => UserProfile, (userProfile) => userProfile.account)
  @JoinColumn()
  userProfile: UserProfile;
}

export default Account;
