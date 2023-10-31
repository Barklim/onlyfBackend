import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { Agency } from './entities/agency.entity';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { Plan } from './enums/agency.enum';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Agency) private readonly agenciesRepository: Repository<Agency>,
  ){}

  async findMe(token: string) {
    try {
      const refreshTokenData = jwt.decode(token) as { email: string };
      const email = refreshTokenData.email;
      const user = await this.usersRepository.findOneBy({
        email: email,
      })
      return user;
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

        return await this.agenciesRepository.save(newAgency);
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
        agency.name = updateAgencyDto.name;
        // TODO: create method
        // agency.plan = updateAgencyDto.plan;
        agency.stopWords = updateAgencyDto.stopWords;
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
}
