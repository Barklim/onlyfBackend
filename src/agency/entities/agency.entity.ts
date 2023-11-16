import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Invite, Plan, UserTimeConstraint } from '../enums/agency.enum';

@Entity()
export class Agency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({unique: true})
  ownerId: string;

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

  @Column('text', { array: true, default: [] })
  admins: string[];

  @Column('text', { array: true, default: [] })
  managers: string[];

  @Column('text', { array: true, default: [] })
  models: string[];

  @Column({default: false})
  verified: boolean;
}