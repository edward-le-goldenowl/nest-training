import { Column, Entity, OneToOne } from 'typeorm';

import BaseEntity from '@common/entities/BaseEntity';

import Account from './account.entity';

@Entity()
class UsersProfile extends BaseEntity {
  @Column()
  public fullName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public dob: Date;

  @Column({ nullable: true })
  public avatar: string;

  @Column({ nullable: true })
  public address: string;

  @Column({ nullable: true })
  public phone: string;

  @OneToOne(() => Account, (account) => account.usersProfile)
  account: Account;
}

export default UsersProfile;
