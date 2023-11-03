import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { SendNotifications } from './notification.send';
import { NotificationType } from '../enums/notification.enum';
import { Role } from '../../users/enums/role.enum';
import { ConfigService } from '@nestjs/config';
import { Invite } from '../../agency/enums/agency.enum';
import { Agency } from '../../agency/entities/agency.entity';

@Injectable()
export class SUserNotifications {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly sendNotifications: SendNotifications,
  ){}

  private GetServerUri() {
    return this.configService.get('SERVER_URI') as unknown as string;
  }

  async OnSignUp(user) {
    const superUsers = await this.usersRepository.findBy({
      role: Role.SuperUser,
    })

    for (const superUser of superUsers) {
      const emailLink = `<a href="${user.email}">${user.email}</a>`;
      const text = `Some user registered with email: ${emailLink}.`;

      await this.sendNotifications.createNotification(superUser.id, 'User signup', text, NotificationType.COMMON);
    }
  }

  async OnSentInvite(user: User, dstUser: User, invite: Invite, agency: Agency) {
    const superUsers = await this.usersRepository.findBy({
      role: Role.SuperUser,
    })

    const userLink = `<a href="${this.GetServerUri()}/user/profile/${user.id}">${user.email}</a>`;
    const dstUserLink = `<a href="${this.GetServerUri()}/user/profile/${dstUser.id}">${dstUser.email}</a>`;
    const text = `User: ${userLink}, sent invitation by role ${invite.role} to ${dstUserLink}. Agency name: ${agency.name}`;

    for (const sUser of superUsers) {
      await this.sendNotifications.createNotification(sUser.id, 'Invitation user by user', text, NotificationType.COMMON);
    }
  }

  async OnAcceptInvite(user: User, invite: Invite, agency: Agency) {
    const dstUserLink = `<a href="${this.GetServerUri()}/user/profile/${user.id}">${user.email}</a>`;
    const text = `User: ${dstUserLink} accept an invitation by role ${invite.role}. To Agency: ${agency.name}`;

    const superUsers = await this.usersRepository.findBy({
      role: Role.SuperUser,
    })

    for (const sUser of superUsers) {
      await this.sendNotifications.createNotification(sUser.id, 'Invitation accept', text, NotificationType.COMMON);
    }
  }
}