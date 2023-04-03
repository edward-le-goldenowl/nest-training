import { Column, Entity, PrimaryColumn, OneToOne } from 'typeorm';
import Account from './account.entity';

@Entity()
class UserProfile {
  @PrimaryColumn()
  public id: string;

  @Column()
  public email: string;

  @Column()
  public fullName: string;

  @Column({ type: 'timestamp with time zone' })
  public dob: Date;

  @OneToOne(() => Account, (account) => account.userProfile)
  account: Account;
}

export default UserProfile;
