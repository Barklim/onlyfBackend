import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { AdminNotifications } from './helpers/notification.admin';
import { ManagerNotifications } from './helpers/notification.manager';
import { AllNotifications } from './helpers/notification.all';
import { SendNotifications } from './helpers/notification.send';
import { SUserNotifications } from './helpers/notification.suser';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User]), ConfigModule.forRoot()],
  providers: [
    NotificationService,
    SendNotifications,
    SUserNotifications,
    AllNotifications,
    AdminNotifications,
    ManagerNotifications,
    ConfigService
  ],
  controllers: [NotificationController]
})
export class NotificationModule {}
