import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Permission, PermissionType } from '../../iam/authorization/permission.type';
import { ApiKey } from '../api-keys/entities/api-key.entity/api-key.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true , default: null})
  agencyId: number | null;

  @Column({ nullable: true , default: null})
  invitedTo: number | null;

  @Column({ enum: Role, default: Role.Regular })
  role: Role;

  @Column({ default: false })
  isTfaEnabled: boolean;

  @Column({ nullable: true })
  tfaSecret: string;

  @Column({ nullable: true })
  googleId: string;

  @JoinTable()
  @OneToMany ( (type) => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];

  // NOTE: Having the "permissions" column in combination with the "role"
  // likely does not make sense. We use both in this course just to showcase
  // two different approaches to authorization.
  @Column({ enum: Permission, default: [], type: 'json' })
  permissions: PermissionType[];
}