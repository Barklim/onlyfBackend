import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Notification } from '../notification/entities/notification.entity';
import { Repository } from 'typeorm';
import jwtConfig from '../iam/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ){}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findMe(token: string) {
    const refreshTokenData = jwt.decode(token) as any;
    const email = refreshTokenData.email;
    const user = await this.usersRepository.findOneBy({
      email: email,
    });
    return user;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({
      id: id,
    })
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
