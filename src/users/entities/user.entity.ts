import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { Permission, PermissionType } from '../../iam/authorization/permission.type';
import { ApiKey } from '../api-keys/entities/api-key.entity/api-key.entity';
import {
  NotificationsSettings,
  NotificationsSource,
  NotificationsType,
  TUserFeatures, TUserJsonSettings,
  TUserSettings,
} from '../enums/user.settings';
import { Profile } from '../../profile/entities/profile.entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({unique: true})
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true , default: null})
  agencyId: string | null;

  @Column({ nullable: true , default: null})
  invitedTo: string | null;

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

  @Column('jsonb', {
    default: {
      notifications: {
        [NotificationsType.EMAIL]: {
          [NotificationsSource.COMMENTS]: true,
          [NotificationsSource.EVENTS]: true,
          [NotificationsSource.INFO]: true,
        },
        [NotificationsType.PUSH]: {
          [NotificationsSource.COMMENTS]: true,
          [NotificationsSource.EVENTS]: true,
          [NotificationsSource.INFO]: true,
        },
      },
    } as TUserSettings,
  })
  settings: TUserSettings;

  @Column({ nullable: false, default: '1' })
  profileId: string;

  @Column({ default: false })
  online: boolean;

  @Column({ nullable: true, default: '' })
  username: string | null;

  @Column('enum', { array: true, enum: Role, default: [Role.Regular] })
  roles: Role[];

  @Column('jsonb', {
    default: {
      "isArticleRatingEnabled": true,
      "isCounterEnabled": true,
      "isAppRedesigned": false,
    } as TUserFeatures,
  })
  features: TUserFeatures;

  @Column({ nullable: false, default: 'https://picsum.photos/800/600' })
  avatar: string;

  @Column('jsonb', {
    default: {
      "isArticlesPageWasOpened": false,
      "theme": 'app_orange_theme',
      "isAccountsPageWasOpened": false,
    } as TUserJsonSettings,
  })
  jsonSettings: TUserJsonSettings;

  @OneToOne(type => Profile)
  @JoinColumn()
  profile?: Profile;
}