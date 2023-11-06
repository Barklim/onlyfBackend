import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../messages/entities/message.entity';
import { ScheduleController } from './schedule.controller';
import { Agency } from '../agency/entities/agency.entity';
import { Incident } from '../incident/entities/incident.entities';
import { Notification } from '../notification/entities/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { SendNotifications } from '../notification/helpers/notification.send';
import { AllNotifications } from '../notification/helpers/notification.all';
import { SUserNotifications } from '../notification/helpers/notification.suser';
import { AdminNotifications } from '../notification/helpers/notification.admin';
import { ManagerNotifications } from '../notification/helpers/notification.manager';
import { EmailService } from '../email/email.service';
import { TelegramService } from '../telegram/telegram.service';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Agency, Incident, Notification, User])
  ],
  providers: [
    ScheduleService,
    NotificationService,
    SendNotifications,
    AllNotifications,
    SUserNotifications,
    AdminNotifications,
    ManagerNotifications,
    EmailService,
    TelegramService,
    ConfigService,
  ],
  controllers: [ScheduleController]
})
export class ScheduleModule {}
