import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { Agency } from './entities/agency.entity';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { Invite, Plan } from './enums/agency.enum';
import { Role } from '../users/enums/role.enum';
import { InviteAgencyDto } from './dto/invite-agency.dto';
import { NotificationService } from '../notification/notification.service';
import { Profile } from '../profile/entities/profile.entities';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Agency) private readonly agenciesRepository: Repository<Agency>,
    @InjectRepository(Profile) private readonly profilesRepository: Repository<Profile>,
    private notificationService: NotificationService,
  ){}

  async findMe(token: string) {
    try {
      const refreshTokenData = jwt.decode(token) as { sub: string };
      const sub = refreshTokenData.sub;
      const agency = await this.agenciesRepository.findOneBy({
        ownerId: sub,
      })
      return agency;
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async createAgency(token: string, createAgencyDto: CreateAgencyDto) {
    try {
      const refreshTokenData = jwt.decode(token) as { email: string };
      const email = refreshTokenData.email;
      const user = await this.usersRepository.findOneBy({
        email: email,
      })
      if (!user) {
        throw new UnauthorizedException('User does not exists');
      }

      const agency = await this.agenciesRepository.findOneBy({
        ownerId: user.id,
      })

      if (agency) {
        throw new ConflictException('Agency by this user already exist');
      } else {
        const newAgency = new Agency();
        newAgency.ownerId = user.id;
        newAgency.name = createAgencyDto.name;
        newAgency.plan = Plan.Free;

        return await this.agenciesRepository.save(newAgency).then(
          (data) => {
            user.role = Role.Admin;
            user.roles = [Role.Admin];
            user.agencyId = newAgency.id;
            this.usersRepository.save(user);
            return data;
          }
        );
      }
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async update(token: string, updateAgencyDto: UpdateAgencyDto) {
    try {
      const refreshTokenData = jwt.decode(token) as { email: string };
      const email = refreshTokenData.email;
      const user = await this.usersRepository.findOneBy({
        email: email,
      })
      if (!user) {
        throw new UnauthorizedException('User does not exists');
      }

      const agency = await this.agenciesRepository.findOneBy({
        ownerId: user.id,
      })

      if (agency) {
        // TODO: create method
        // agency.plan = updateAgencyDto.plan;
        agency.name = updateAgencyDto.name;
        agency.stopWords = updateAgencyDto.stopWords;
        if (updateAgencyDto.userTimeConstraint) {
          agency.userTimeConstraint = {
            ...agency.userTimeConstraint,
            ...updateAgencyDto.userTimeConstraint,
          };
        }

        return await this.agenciesRepository.save(agency);
      } else {
        throw new ConflictException('Agency by this user dont exist');
      }
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async inviteAgency(token: string, inviteAgencyDto: InviteAgencyDto) {
    try {
      const refreshTokenData = jwt.decode(token) as { email: string };
      const email = refreshTokenData.email;
      const user = await this.usersRepository.findOneBy({
        email: email,
      })
      if (!user) {
        throw new UnauthorizedException('User does not exists');
      }

      if (user.role !== Role.Admin) {
        throw new UnauthorizedException('User does not admin');
      }

      const agency = await this.agenciesRepository.findOneBy({
        ownerId: user.id,
      })

      // TODO: let send invites for all admins, not only for owner
      if (agency.ownerId !== user.id) {
        throw new UnauthorizedException('User does not owner of this agency');
      }

      if (agency) {
        const existingInvite = agency.invites.find((invite) => invite.id === inviteAgencyDto.id);
        if (existingInvite) {
          throw new ConflictException('Invite for this user already exist');
        } else {
          const inviteObj = {
            id: inviteAgencyDto.id,
            role: inviteAgencyDto.role,
            accepted: false
          } as Invite;

          if (inviteObj.role === Role.SuperUser) {
            throw new ConflictException('Impossible operation');
          }
          agency.invites.push(inviteObj);

          return await this.agenciesRepository.save(agency).then(
            async (data) => {

              const dstUser = await this.usersRepository.findOneBy({
                id: inviteAgencyDto.id,
              })
              dstUser.invitedTo = agency.id;
              await this.usersRepository.save(dstUser);
              await this.notificationService.OnSentInvite(user, inviteObj, agency)

              const profile = await this.profilesRepository.findOneBy({
                id: dstUser.profileId,
              })
              profile.verified = true;
              await this.profilesRepository.save(profile);

              return data;
            }
          );
        }
      } else {
        throw new ConflictException('Agency by this user dont exist');
      }
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async remove(token: string, id: string) {
    try {
      const refreshTokenData = jwt.decode(token) as { email: string };
      const email = refreshTokenData.email;
      const user = await this.usersRepository.findOneBy({
        email: email,
      })
      if (!user) {
        throw new UnauthorizedException('User does not exists');
      }

      if (user.role !== Role.Admin) {
        throw new UnauthorizedException('User does not admin');
      }

      const agency = await this.agenciesRepository.findOneBy({
        ownerId: user.id,
      })

      // TODO: let send invites for all admins, not only for owner
      if (agency.ownerId !== user.id) {
        throw new UnauthorizedException('User does not owner of this agency');
      }

      if (agency) {
        const existingInvite = agency.invites.find((invite) => invite.id === id);
        if (existingInvite) {
          const updatedInvitesArr = agency.invites.filter((invite) => invite.id !== id);

          if (existingInvite.role === Role.Admin) {
            agency.admins = agency.admins.filter((itemId) => itemId !== id)
          }
          if (existingInvite.role === Role.Manager) {
            agency.managers = agency.managers.filter((itemId) => itemId !== id)
          }
          if (existingInvite.role === Role.Model) {
            agency.models = agency.models.filter((itemId) => itemId !== id)
          }

          agency.invites = updatedInvitesArr;
          return await this.agenciesRepository.save(agency).then(
            async (data) => {

              const user = await this.usersRepository.findOneBy({
                id: id,
              })
              user.invitedTo = null;
              user.agencyId = null;
              user.role = Role.Regular
              user.roles = [Role.Regular]
              await this.usersRepository.save(user);

              const profile = await this.profilesRepository.findOneBy({
                id: user.profileId,
              })
              profile.verified = false;
              await this.profilesRepository.save(profile);

              return data;
            }
          );
        } else {
          throw new ConflictException('Invite for this user doesnt exist');
        }
      } else {
        throw new ConflictException('Agency by this user dont exist');
      }
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async acceptInvite(token: string) {
    try {
      const refreshTokenData = jwt.decode(token) as { email: string };
      const email = refreshTokenData.email;
      const user = await this.usersRepository.findOneBy({
        email: email,
      })
      if (!user) {
        throw new UnauthorizedException('User does not exists');
      }

      const id = user.id;

      const agency = await this.agenciesRepository.findOneBy({
        id: user.invitedTo,
      })

      // TODO: check that this user exist invitation in agency.invites
      // if (agency.ownerId !== user.id) {
      //   throw new UnauthorizedException('User does not owner of this agency');
      // }

      if (agency) {
        const existingInvite = agency.invites.find((invite) => invite.id === id) as Invite;
        if (existingInvite) {

          if (!existingInvite.accepted) {
            const updatedInvitesArr = agency.invites.filter((invite) => invite.id !== id);

            updatedInvitesArr.push(
              {
                id: existingInvite.id,
                role: existingInvite.role,
                accepted: true
              }
            )

            agency.invites = updatedInvitesArr;
            if (existingInvite.role === Role.Admin) {
              agency.admins.push(existingInvite.id)
            }
            if (existingInvite.role === Role.Manager) {
              agency.managers.push(existingInvite.id)
            }
            if (existingInvite.role === Role.Model) {
              agency.models.push(existingInvite.id)
            }

            return await this.agenciesRepository.save(agency).then(
              async (data) => {

                user.role = existingInvite.role;
                user.roles = [existingInvite.role]
                user.agencyId = agency.id;
                await this.usersRepository.save(user);
                await this.notificationService.OnAcceptInvite(user, existingInvite, agency)

                return data;
              }
            );
          } else {
            throw new ConflictException('Invite for this user already accepted');
          }
        } else {
          throw new ConflictException('Invite for this user doesnt exist');
        }
      } else {
        throw new ConflictException('Agency by this user dont exist');
      }

    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }
}
