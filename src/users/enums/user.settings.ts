export enum NotificationsType {
  PUSH = 'push',
  EMAIL = 'email',
}

export enum NotificationsSource {
  COMMENTS = 'comments',
  EVENTS = 'events',
  INFO = 'info',
}

export type NotificationsSettings = {
  [key in NotificationsType]: NotificationsSettingsItem
};

export type NotificationsSettingsItem = {
  [key in NotificationsSource]: boolean
};


export type TUserSettings = {
  notifications: NotificationsSettings,
};

export type TUserFeatures = {
  [key: string]: boolean;
};

export type TUserJsonSettings = {
  [key: string]: boolean | string;
};

export type TUserTheme = 'app_orange_theme' | 'app_dark_theme' | 'app_light_theme';