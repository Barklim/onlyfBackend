import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: string;

  // @Column({ type: 'date' })
  // createdAt: string;
  // @Column({ type: 'timestamptz' })
  // date_time_with_timezone: Date;

  @Column()
  ofId: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  msg_created_at: string;

  // Onlyf
  @Column({unique: true})
  msgId: string;

  // Onlyf
  @Column()
  fromUserId: string;

  // Onlyf
  @Column()
  chatId: string;

  @Column()
  managerId: string;

  @Column()
  agencyId: string;

  @Column({ nullable: true })
  text: string;

  @Column({default: false})
  isCounted: boolean;

  @Column({default: false})
  isRead: boolean;
}