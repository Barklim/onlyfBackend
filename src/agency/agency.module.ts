import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Agency } from './entities/agency.entity';
import { NotificationService } from '../notification/notification.service';
import { SUserNotifications } from '../notification/helpers/notification.suser';
import { AllNotifications } from '../notification/helpers/notification.all';
import { SendNotifications } from '../notification/helpers/notification.send';
import { AdminNotifications } from '../notification/helpers/notification.admin';
import { ManagerNotifications } from '../notification/helpers/notification.manager';
import { Notification } from '../notification/entities/notification.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { TelegramService } from '../telegram/telegram.service';
import { Profile } from '../profile/entities/profile.entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Agency, Profile, Notification]), ConfigModule.forRoot()],
  providers: [
    AgencyService,
    ConfigService,
    NotificationService,
    SUserNotifications,
    AllNotifications,
    SendNotifications,
    AdminNotifications,
    ManagerNotifications,
    EmailService,
    TelegramService
  ],
  controllers: [AgencyController]
})
export class AgencyModule {}
