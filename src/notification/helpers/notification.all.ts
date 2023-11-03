import { Injectable } from '@nestjs/common';
import { ManagerNotifications } from './notification.manager';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { NotificationType } from '../enums/notification.enum';
import { Role } from '../../users/enums/role.enum';
import { SendNotifications } from './notification.send';
import { ConfigService } from '@nestjs/config';
import { Invite } from '../../agency/enums/agency.enum';
import { Agency } from '../../agency/entities/agency.entity';

@Injectable()
export class AllNotifications {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly managerNotifications: ManagerNotifications,
    private readonly sendNotifications: SendNotifications,
  ){}

  private GetServerUri() {
    return this.configService.get('SERVER_URI') as unknown as string;
  }

  async OnSignUp(user) {
    const tfaLink = `<a href="${this.GetServerUri()}/tfa/${user.id}">here </a>`;
    const text = `Please do double factor authentication for safety. Click ${tfaLink}.`;

    await this.sendNotifications.createNotification(user.id, 'Welcome  🎉 🎉 🎉', text, NotificationType.COMMON);

    // switch (user.role) {
    //   case Role.Admin:
    //     await this.managerNotifications.OnLogin(user);
    //     break;
    //   case Role.Manager:
    //     break;
    //   case Role.Model:
    //     break;
    //   case Role.Regular:
    //     break;
    // }
    // await this.managerNotifications.OnLogin(a);
  }

  async OnSentInvite(user: User, dstUser: User, invite: Invite, agency: Agency) {
    for (const id of agency.admins) {
      const userLink = `<a href="${this.GetServerUri()}/user/profile/${dstUser.id}">${dstUser.email}</a>`;
      const text = `You sent an invitation to user: ${userLink}, by role ${invite.role}. You can always cancel your decision. From Agency: ${agency.name}`;

      await this.sendNotifications.createNotification(id, 'Invitation sent', text, NotificationType.COMMON);
    }

    const ownerUser = await this.usersRepository.findOneBy({
      id: agency.ownerId
    })
    const userLink = `<a href="${this.GetServerUri()}/user/profile/${dstUser.id}">${dstUser.email}</a>`;
    const text = `You sent an invitation to user: ${userLink}, by role ${invite.role}. You can always cancel your decision. From Agency: ${agency.name}`;
    await this.sendNotifications.createNotification(ownerUser.id, 'Invitation sent', text, NotificationType.COMMON);

    const dstUserLink = `<a href="${this.GetServerUri()}/user/profile/${ownerUser.id}">${ownerUser.email}</a>`;
    const acceptLink = `<a href="${this.GetServerUri()}/user/profile/${ownerUser.id}">Accept</a>`;
    const dstUserText = `You have received an invitation from a user: ${dstUserLink}, by role ${invite.role}. From Agency: ${agency.name}.
    \n${acceptLink} invitation.`;

    await this.sendNotifications.createNotification(dstUser.id, 'An invitation has arrived.', dstUserText, NotificationType.COMMON);
  }

  async OnAcceptInvite(user: User, invite: Invite, agency: Agency) {
    const text = `You accept an invitation by role ${invite.role}. To Agency: ${agency.name}`;

    await this.sendNotifications.createNotification(invite.id, 'Invitation accept', text, NotificationType.COMMON);

    for (const id of agency.admins) {
      const dstUserLink = `<a href="${this.GetServerUri()}/user/profile/${user.id}">${user.email}</a>`;
      const adminUserText = `User: ${dstUserLink} has accept invitation by role ${invite.role}. To Agency: ${agency.name}`;

      await this.sendNotifications.createNotification(id, 'Invitation has accept.', adminUserText, NotificationType.COMMON);
    }

    const dstUserLink = `<a href="${this.GetServerUri()}/user/profile/${user.id}">${user.email}</a>`;
    const adminUserText = `User: ${dstUserLink} has accept invitation by role ${invite.role}. To Agency: ${agency.name}`;

    await this.sendNotifications.createNotification(agency.ownerId, 'Invitation has accept.', adminUserText, NotificationType.COMMON);
  }
}