import {
  Column,
  Entity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';
import UserProfile from './userProfile.entity';

@Entity()
class Account {
  @PrimaryColumn()
  public id: string;

  @Column()
  public username: string;

  @Column()
  public password: string;

  @Column()
  public userProfileId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeUpdate()
  updateTimestamps() {
    this.updated_at = new Date();
  }

  @OneToOne(() => UserProfile, (userProfile) => userProfile.account)
  @JoinColumn()
  userProfile: UserProfile;
}

export default Account;
