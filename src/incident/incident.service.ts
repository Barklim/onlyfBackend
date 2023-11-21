import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/incident.entities';
import { TIncident } from './enums/incident.enum';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/entities/user.entity';

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
  @InjectRepository(User) private readonly usersRepository: Repository<User>

  async findAll(ofId: string, managerId: string, type: TIncident, startDate: Date, endDate: Date) {
    const findObj = {}
    if (ofId) { findObj['ofId'] = ofId }
    if (managerId) { findObj['managerId'] = managerId }
    if (type) { findObj['type'] = type }

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

  async createIncident(token: string, data: any) {
    const refreshTokenData = jwt.decode(token) as { email: string };
    const email = refreshTokenData.email;
    const user = await this.usersRepository.findOneBy({
      email: email,
    })

    const newIncident = new Incident();
    newIncident.type = TIncident.Chat;
    newIncident.managerId = user.id;
    newIncident.agencyId = user.agencyId;
    newIncident.msgId = 'msgId';
    newIncident.incident_created_at = new Date(Date.now()).toISOString();
    newIncident.isCounted = true;
    //
    newIncident.stopWords = data.stopWords;
    newIncident.ofId = data.ofId;

    return await this.incidentsRepository.save(newIncident)
  }
}
