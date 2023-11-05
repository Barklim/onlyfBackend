import { NotificationsSettings, NotificationsSource, NotificationsType } from '../../users/enums/user.settings';

export type UpdateNotificationsRequestItem = {
  type: NotificationsType,
  source: NotificationsSource,
  value: boolean,
};

export type UpdateNotificationsRequestData = Array<UpdateNotificationsRequestItem>;

export type UpdateNotificationsResponseData = {
  notifications: NotificationsSettings,
};