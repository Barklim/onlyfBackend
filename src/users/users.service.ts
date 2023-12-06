import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import jwtConfig from '../iam/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { NotificationsSource, NotificationsType, TUserSettings } from './enums/user.settings';
import { UpdateNotificationsRequestData } from '../notification/dto/update-notifications.dto';
import { FindAllParams } from './dto/findAll.dto';
import { Profile } from '../profile/entities/profile.entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profilesRepository: Repository<Profile>
  ){}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(params: FindAllParams) {
    const { _expand, _limit, _page, _sort, _order, q, roles } = params;
    const query = this.usersRepository.createQueryBuilder('user');

    if (_expand && _sort !== 'username') {
      query.leftJoinAndSelect('user.profile', 'profile');
    }

    if (_limit && _page) {
      const limit = parseInt(_limit, 10);
      const page = parseInt(_page, 10);
      query.skip((page - 1) * limit).take(limit);
    }

    if (_sort) {
      const order = _order === 'desc' ? 'DESC' : 'ASC';

      if (_sort === 'username') {
        query.addSelect('profile.username');
        query.leftJoin('user.profile', 'profile');
        query.addOrderBy('profile.username', order);
      } else if (_sort === 'createdAt') {
        query.addOrderBy('user.created_at', order);
      } else if (_sort === 'online') {
        query.addOrderBy('user.online', order);
      }
    }

    if (q) {
      query
        .innerJoin('user.profile', 'profile')
        .where('profile.username LIKE :q', { q: `%${q}%` });
    }

    if (roles) {
      const rolesArray = roles.toLowerCase().split(',');
      query.andWhere('user.roles @> :roles', { roles: rolesArray });
    }

    // query.andWhere('profile.isVisible = :isVisible', { isVisible: true });
    query.andWhere("user.settings @> :settings", { settings: { isVisible: true } });

    const users = await query.getMany();

    if (_expand) {
      const userProfiles = await Promise.all(users.map(async (user) => {
        const profile = await this.profilesRepository.findOneBy({
          id: user.profileId,
        });

        return {
          ...user,
          profile,
        };
      }));

      return userProfiles;
    }

    return users;
  }

  async findMe(token: string) {
    const refreshTokenData = jwt.decode(token) as any;
    const email = refreshTokenData.email;
    const user = await this.usersRepository.findOneBy({
      email: email,
    });
    return user;
  }

  async setNotificationsSettings(token: string, settingsData: UpdateNotificationsRequestData) {
    const refreshTokenData = jwt.decode(token) as any;
    const email = refreshTokenData.email;
    const user = await this.usersRepository.findOneBy({
      email: email,
    });

    let settings = user.settings || {} as TUserSettings;
    settingsData.map((settingsItem) => {
      const { type, source, value } = settingsItem;
      if (settings?.notifications === undefined) {
        settings.notifications = {
          [NotificationsType.EMAIL]: {
            [NotificationsSource.COMMENTS]: true,
            [NotificationsSource.EVENTS]: true,
            [NotificationsSource.INFO]: true,
          },
          [NotificationsType.PUSH]: {
            [NotificationsSource.COMMENTS]: true,
            [NotificationsSource.EVENTS]: true,
            [NotificationsSource.INFO]: true,
          }
        };
      }
      if (settings?.notifications[type]) {
        settings.notifications[type][source] = !!value;
      }
    });

    await this.usersRepository.save(user);

    return user;
    // return user.settings;
  }

  async findOne(id: string, _expand: string) {
    const user = await this.usersRepository.findOneBy({
      id: id,
    })

    if (_expand) {
      const profile = await this.profilesRepository.findOneBy({
        id: user.profileId,
      });

      return {
        ...user,
        profile,
      };
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({
      id: id,
    })

    if (updateUserDto.isVisible !== undefined) {
      user.settings.isVisible = updateUserDto.isVisible;
    }

    if (updateUserDto.isAccountsPageWasOpened !== undefined) {
      user.jsonSettings['isAccountsPageWasOpened'] = updateUserDto.isAccountsPageWasOpened;
    }
    if (updateUserDto.isCookieDefined !== undefined) {
      user.jsonSettings['isCookieDefined'] = updateUserDto.isCookieDefined;
    }
    if (updateUserDto.theme !== undefined) {
      user.jsonSettings['theme'] = updateUserDto.theme;
    }
    if (updateUserDto.isArticlesPageWasOpened !== undefined) {
      user.jsonSettings['isArticlesPageWasOpened'] = updateUserDto.isArticlesPageWasOpened;
    }
    if (updateUserDto.theme !== undefined) {
      user.jsonSettings['theme'] = updateUserDto.theme;
    }

    if (updateUserDto.features) {
      if (updateUserDto.features['isArticleRatingEnabled'] !== undefined) {
        user.features['isArticleRatingEnabled'] = updateUserDto.features['isArticleRatingEnabled']
      }
      if (updateUserDto.features['isCounterEnabled'] !== undefined) {
        user.features['isCounterEnabled'] = updateUserDto.features['isCounterEnabled']
      }
      if (updateUserDto.features['isAppRedesigned'] !== undefined) {
        user.features['isAppRedesigned'] = updateUserDto.features['isAppRedesigned']
      }
    }

    return  await this.usersRepository.save(user);
  }

  async remove(token: string) {
    const refreshTokenData = jwt.decode(token) as any;
    const email = refreshTokenData.email;
    const user = await this.usersRepository.findOneBy({
      email: email,
    });

    const profile = await this.profilesRepository.findOneBy({
      id: user.profileId,
    });

    user ? this.usersRepository.remove(user) : null;
    profile ? this.profilesRepository.remove(profile) : null;

    return user;
  }
}
