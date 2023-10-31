import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Agency } from './entities/agency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Agency])],
  providers: [AgencyService],
  controllers: [AgencyController]
})
export class AgencyModule {}
