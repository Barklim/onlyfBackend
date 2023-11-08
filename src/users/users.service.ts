import { Inject, Injectable } from '@nestjs/common';
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

    // console.log('!!! 123');
    // console.log(_sort);
    // console.log('!!!');

    // if (params.q) {
    //   query.where('user.profile.username LIKE :q', { q: `%${params.q}%` });
    // }

    // if (params._sort) {
    //   const order = params._order === 'desc' ? 'DESC' : 'ASC';
    //   query.orderBy(`user.${params._sort}`, order);
    // }

    if (_limit && _page) {
      const limit = parseInt(_limit, 10);
      const page = parseInt(_page, 10);
      query.skip((page - 1) * limit).take(limit);
    }

    const users = await query.getMany();

    if (_expand) {
      const userProfiles = await Promise.all(users.map(async (user) => {
        const profile = await this.profilesRepository.findOneBy({
          id: Number(user.profileId),
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

  async findOne(id: number, _expand: string) {
    const user = await this.usersRepository.findOneBy({
      id: id,
    })

    if (_expand) {
      const profile = await this.profilesRepository.findOneBy({
        id: Number(user.profileId),
      });

      return {
        ...user,
        profile,
      };
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
