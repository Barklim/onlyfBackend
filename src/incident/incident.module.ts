import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Incident])],
  providers: [IncidentService],
  controllers: [IncidentController]
})
export class IncidentModule {}
