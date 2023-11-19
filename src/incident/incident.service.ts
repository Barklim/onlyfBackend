import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/incident.entities';

function getTypeByTime(incidentCreatedAt: any) {
  const createdAtDate = new Date(incidentCreatedAt);
  const hours = createdAtDate.getHours();

  if (hours >= 0 && hours < 8) {
      return '3';
  } else if (hours >= 8 && hours < 16) {
      return '1';
  } else {
      return '2';
  }
}


@Injectable()
export class IncidentService {
  @InjectRepository(Incident) private readonly incidentsRepository: Repository<Incident>

  async findAll(ofId: string, managerId: string, startDate: Date, endDate: Date) {
    const findObj = {}
    if (ofId) { findObj['ofId'] = ofId }
    if (managerId) { findObj['managerId'] = managerId }

    const incidents: Incident[] = await this.incidentsRepository.findBy(findObj);

    incidents.forEach((incident) => {
      incident.workShift = getTypeByTime(incident.incident_created_at);
    });

    if (startDate === null || endDate === null) {
      return incidents;
    }

    const filteredIncidents: Incident[] = incidents.filter((incident) => {
      // const incidentsCreatedAt = new Date(incident.created_at);
      const incidentsCreatedAt = new Date(incident.incident_created_at);
      let startUtc = new Date(startDate);
      let endUtc = new Date(endDate);

      startUtc.setHours(startUtc.getHours());
      endUtc.setHours(endUtc.getHours());

      return (
        incidentsCreatedAt >= startUtc &&
        incidentsCreatedAt <= endUtc
      );
    });

    return filteredIncidents
  }
}
