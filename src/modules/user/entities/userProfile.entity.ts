import {
  Column,
  Entity,
  OneToOne,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ nullable: true })
  public avatar: string;

  @Column({ nullable: true })
  public address: string;

  @Column({ nullable: true })
  public phone: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToOne(() => Account, (account) => account.userProfile)
  account: Account;
}

export default UserProfile;
