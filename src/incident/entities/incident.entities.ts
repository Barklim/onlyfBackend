import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TIncident } from '../enums/incident.enum';

@Entity()
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ofId: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({unique: false})
  msgId: string | null;

  @Column({unique: false})
  stopWords: string | null;

  @Column({ enum: TIncident, default: TIncident.Chat })
  type: TIncident;

  @Column()
  agencyId: number;

  @Column({default: false})
  isCounted: boolean;
}