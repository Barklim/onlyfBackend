import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  providers: [ProfileService],
  controllers: [ProfileController]
})
export class ProfileModule {}
