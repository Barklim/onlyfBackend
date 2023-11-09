import { Role } from '../../users/enums/role.enum';

export enum Plan {
  Free = 'free',
  Basic = 'basic',
  Pro = 'Pro',
}

export type Invite = {
  id: string;
  role: Role;
  accepted: boolean;
};

export type UserTimeConstraint =  { [key: string]: number };