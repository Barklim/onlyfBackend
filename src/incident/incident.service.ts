import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/incident.entities';

@Injectable()
export class IncidentService {
  @InjectRepository(Incident) private readonly incidentsRepository: Repository<Incident>

  async findAll(id: string, startDate: Date, endDate: Date) {
    const incidents: Incident[] = await this.incidentsRepository.findBy({
      ofId: id,
    });
    const filteredIncidents: Incident[] = incidents.filter((incident) => {
      const incidentsCreatedAt = new Date(incident.created_at);
      return incidentsCreatedAt >= startDate && incidentsCreatedAt <= endDate;
    });

    return filteredIncidents
  }
}
