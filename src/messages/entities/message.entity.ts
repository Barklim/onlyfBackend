import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({unique: true})
  msgId: string;

  @Column()
  fromUserId: string;

  @Column()
  chatId: string;

  @Column()
  agencyId: number;

  @Column({ nullable: true })
  text: string;

  @Column({default: false})
  isCounted: boolean;

  @Column({default: false})
  isRead: boolean;
}