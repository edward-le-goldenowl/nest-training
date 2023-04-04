import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm';
import UserProfile from './userProfile.entity';

@Entity()
class Account {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public email: string;

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
