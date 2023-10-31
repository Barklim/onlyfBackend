import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Plan } from '../enums/agency.enum';

@Entity()
export class Agency {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({unique: true})
  ownerId: number;

  @Column()
  name: string;

  @Column({ enum: Plan, default: Plan.Free })
  plan: Plan;

  @Column({default: ''})
  stopWords: string;

  @Column('text', { array: true, default: [] })
  admins: string[];

  @Column('text', { array: true, default: [] })
  managers: string[];

  @Column('text', { array: true, default: [] })
  models: string[];

  @Column({default: false})
  verified: boolean;
}