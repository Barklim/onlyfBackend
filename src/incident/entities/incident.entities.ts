import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TIncident } from '../enums/incident.enum';

@Entity()
export class Incident {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  ofId: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column()
  incident_created_at: string;

  @Column({unique: false})
  msgId: string | null;

  @Column({unique: false})
  stopWords: string | null;

  @Column({ enum: TIncident, default: TIncident.Chat })
  type: TIncident;

  @Column()
  agencyId: string;

  @Column()
  managerId: string;

  @Column({default: false})
  isCounted: boolean;

  @Column({default: ''})
  workShift?: string;
}