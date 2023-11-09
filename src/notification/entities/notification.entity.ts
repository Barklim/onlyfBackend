import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationType } from '../enums/notification.enum';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: string;

  // date: Date;
  @CreateDateColumn()
  created_at: Date;

  @Column({ enum: NotificationType, default: NotificationType.COMMON })
  type: NotificationType;

  @Column()
  dstUserId: string;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column({default: false})
  isRead: boolean;

  @Column({default: false})
  isDelete: boolean;
}