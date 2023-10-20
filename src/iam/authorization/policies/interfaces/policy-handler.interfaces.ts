import { ActiveUserData } from '../../../interfaces/active-user-data.interface';
import { Policy } from './policy.interface';

export interface PolicyHandler<T extends Policy> {
  handle(policy: T, user: ActiveUserData): Promise<void>;
}