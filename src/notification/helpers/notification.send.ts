import { ConflictException, Injectable } from '@nestjs/common';
import { NotificationType } from '../enums/notification.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class SendNotifications {
  constructor(
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ){}

  async createNotification(dstUserId: number, title: string, text: string, type: NotificationType = NotificationType.COMMON) {
    try {
      const dstUser = await this.usersRepository.findOneBy({
        id: dstUserId,
      })
      const notificationSettings = (dstUser.settings && dstUser.settings.notifications) ? dstUser.settings.notifications : null;
      let allowSend = true;

      if (notificationSettings && notificationSettings.push) {
        switch (type) {
          case NotificationType.COMMON:
            allowSend = (notificationSettings.push.info !== undefined) ? !!notificationSettings.push.info : true;
            break;
          case NotificationType.EVENTS:
            allowSend = (notificationSettings.push.events !== undefined) ? !!notificationSettings.push.events : true;
            break;
          case NotificationType.CHAT:
            allowSend = (notificationSettings.push.comments !== undefined) ? !!notificationSettings.push.comments : true;
            break;
        }
      }

      if (allowSend) {
        return await this.notificationsRepository.save({ dstUserId, title, text, type });
      }
      return null;

    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }
}