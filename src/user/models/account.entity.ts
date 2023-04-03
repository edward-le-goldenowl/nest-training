import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
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

  @OneToOne(() => UserProfile, (userProfile) => userProfile.account)
  @JoinColumn()
  userProfile: UserProfile;
}

export default Account;
