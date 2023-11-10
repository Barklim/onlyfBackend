import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entities';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  @InjectRepository(Profile) private readonly profilesRepository: Repository<Profile>

  async findOne(id: string) {
    const profile = await this.profilesRepository.findOneBy({
      id: id,
    })
    return profile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profilesRepository.findOneBy({
      id: id,
    })

    if (profile.avatar) {
      profile.avatar = updateProfileDto.avatar;
    }
    if (profile.username) {
      profile.username = updateProfileDto.username;
    }

    return await this.profilesRepository.save(profile);
  }
}
