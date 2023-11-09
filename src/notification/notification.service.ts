import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { AllNotifications } from './helpers/notification.all';
import { SUserNotifications } from './helpers/notification.suser';
import { Invite } from '../agency/enums/agency.enum';
import { Agency } from '../agency/entities/agency.entity';
import { GetNotificationsCountResponseData } from './dto/get-count.dto';
import { Incident } from '../incident/entities/incident.entities';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly sUserNotifications: SUserNotifications,
    private readonly allNotifications: AllNotifications,
  ){}

  async getNotificationForUser(dstUserId: string): Promise<Array<Notification>> {
    const notifications = await this.notificationsRepository.findBy({
      dstUserId: dstUserId,
      isDelete: false
    })

    notifications.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    notifications
      .filter(notifications => !notifications.isRead)
      .map(async notification => {
        notification.isRead = true;
        await this.notificationsRepository.save(notification);
      })
      .slice(0, 9);

    return notifications;
  }

  async getNotificationCountForUser(dstUserId: string): Promise<GetNotificationsCountResponseData> {
    const count = (await this.notificationsRepository.findBy({
      dstUserId: dstUserId,
      isRead: false
    })).length

    return { count };
  }

  async markAsRead(notificationId: string, dstUserId: string): Promise<Notification | null> {
    const notification = await this.notificationsRepository.findOneBy({
      id: notificationId,
      dstUserId: dstUserId
    })
    notification.isRead = true;
    return  await this.notificationsRepository.save(notification);
  }

  async markAsDelete(notificationId: string, dstUserId: string): Promise<Notification | null> {
    const notification = await this.notificationsRepository.findOneBy({
      id: notificationId,
      dstUserId: dstUserId
    })
    notification.isDelete = true;
    return await this.notificationsRepository.save(notification);
  }

  async OnSignUp(dstUserId: string) {
    const user = await this.usersRepository.findOneBy({
      id: dstUserId,
    })
    await this.allNotifications.OnSignUp(user);
    await this.sUserNotifications.OnSignUp(user);
  }

  async OnSentInvite(user: User, invite: Invite, agency: Agency) {
    const dstUser = await this.usersRepository.findOneBy({
      id: invite.id
    })
    await this.allNotifications.OnSentInvite(user, dstUser, invite, agency);
    await this.sUserNotifications.OnSentInvite(user, dstUser, invite, agency);
  }

  async OnAcceptInvite(user: User, invite: Invite, agency: Agency) {
    await this.allNotifications.OnAcceptInvite(user, invite, agency);
    await this.sUserNotifications.OnAcceptInvite(user, invite, agency);
  }

  async OnIncident(agency: Agency, incident: Incident) {
    await this.allNotifications.OnIncident(agency, incident);
    await this.sUserNotifications.OnIncident(agency, incident);
  }
}
