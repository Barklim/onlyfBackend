import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Invite, Plan, UserTimeConstraint } from '../enums/agency.enum';

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

  @Column('jsonb', { default: [] })
  invites: Invite[];

  @Column('jsonb', { default: {} })
  userTimeConstraint: UserTimeConstraint;

  @Column('integer', { array: true, default: [] })
  admins: number[];

  @Column('integer', { array: true, default: [] })
  managers: number[];

  @Column('integer', { array: true, default: [] })
  models: number[];

  @Column({default: false})
  verified: boolean;
}