import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  @InjectRepository(Profile) private readonly profilesRepository: Repository<Profile>


  async findOne(id: string) {
    const profile = await this.profilesRepository.findOneBy({
      id: id,
    })
    return profile;
  }
}
