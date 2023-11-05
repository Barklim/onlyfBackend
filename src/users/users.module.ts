import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ApiKey } from './api-keys/entities/api-key.entity/api-key.entity';
import { AdminNotifications } from '../notification/helpers/notification.admin';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/entities/notification.entity';
import { ManagerNotifications } from '../notification/helpers/notification.manager';
import { AllNotifications } from '../notification/helpers/notification.all';
import { SendNotifications } from '../notification/helpers/notification.send';
import { SUserNotifications } from '../notification/helpers/notification.suser';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { TelegramService } from '../telegram/telegram.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ApiKey, Notification]), ConfigModule.forRoot()],
  controllers: [UsersController],
  providers: [
    UsersService,
    NotificationService,
    SendNotifications,
    AllNotifications,
    SUserNotifications,
    AdminNotifications,
    ManagerNotifications,
    EmailService,
    TelegramService,
    ConfigService
  ],
})
export class UsersModule {}
