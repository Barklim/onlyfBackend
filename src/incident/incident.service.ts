import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/incident.entities';

@Injectable()
export class IncidentService {
  @InjectRepository(Incident) private readonly incidentsRepository: Repository<Incident>

  async findAll(ofId: string, managerId: string, startDate: Date, endDate: Date) {
    const findObj = {}
    if (ofId) { findObj['ofId'] = ofId }
    if (managerId) { findObj['managerId'] = managerId }

    console.log('!!! zxc');
    console.log(findObj);
    console.log('!!!');

    const incidents: Incident[] = await this.incidentsRepository.findBy(findObj);

    const filteredIncidents: Incident[] = incidents.filter((incident) => {
      // const incidentsCreatedAt = new Date(incident.created_at);
      const incidentsCreatedAt = new Date(incident.incident_created_at);
      let startUtc = new Date(startDate);
      let endUtc = new Date(endDate);

      startUtc.setHours(startUtc.getHours() + 8);
      endUtc.setHours(endUtc.getHours() + 8);

      return (
        incidentsCreatedAt >= startUtc &&
        incidentsCreatedAt <= endUtc
      );
    });

    return filteredIncidents
  }
}
