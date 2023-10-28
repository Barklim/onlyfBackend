import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({unique: true})
  chatId: string;

  @Column({ nullable: true })
  createdAt: string;

  @Column({ nullable: true })
  text: string;

  @Column({default: false})
  counted: boolean;
}