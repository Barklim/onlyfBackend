import { Notification } from '../entities/notification.entity';

export type GetNotificationsCountResponseData = {
  count: number;
};

export type GetNotificationsResponseData = {
  notifications: Array<Notification>
};