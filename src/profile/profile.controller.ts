import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }
}
