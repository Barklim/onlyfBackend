import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../enums/scrapper.enum';

@Entity()
export class Scrapper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({unique: true})
  ofId: string;

  @Column({ enum: Status, default: Status.Offline })
  status: Status;
}