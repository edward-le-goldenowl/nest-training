import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.account)
  @JoinColumn()
  userProfile: UserProfile;
}

export default Account;
