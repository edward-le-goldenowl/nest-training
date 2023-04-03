import { Column, Entity, PrimaryColumn, OneToOne, BeforeUpdate } from 'typeorm';
import Account from './account.entity';

@Entity()
class UserProfile {
  @PrimaryColumn()
  public id: string;

  @Column()
  public email: string;

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
