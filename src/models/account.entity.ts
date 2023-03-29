import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
class Account {
  @PrimaryColumn()
  public id: string;

  @Column()
  public userId: string;

  @Column()
  public username: string;

  @Column()
  public password: string;
}

export default Account;
