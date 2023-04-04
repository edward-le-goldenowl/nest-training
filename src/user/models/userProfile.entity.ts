import {
  Column,
  Entity,
  OneToOne,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Account from './account.entity';

@Entity()
class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public fullName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public dob: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamps() {
    this.updatedAt = new Date();
  }

  @OneToOne(() => Account, (account) => account.userProfile)
  account: Account;
}

export default UserProfile;
