import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../messages/entities/message.entity';
import { Repository } from 'typeorm';
import { Agency } from '../agency/entities/agency.entity';
import { Incident } from '../incident/entities/incident.entities';
import { TIncident } from '../incident/enums/incident.enum';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Message) private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Agency) private readonly agenciesRepository: Repository<Agency>,
    @InjectRepository(Incident) private readonly incidentsRepository: Repository<Incident>,
    private readonly notificationService: NotificationService
  ){}

  @Cron('*/10 * * * * *')
  // @Cron('* * */10 * * *')
  async handleCron() {
    console.log('chron handleCron');

    const currentTime = new Date();
    const messages = await this.messagesRepository.findBy({
      isRead: false,
    });

    const filteredMessages = await Promise.all(messages.map(async (message) => {
      const msgCreatedAt = new Date(message.msg_created_at);
      const agency = await this.agenciesRepository.findOneBy({
        id: message.agencyId,
      });
      const timeDelay = agency.userTimeConstraint[message.ofId];
      const delay = timeDelay === undefined ? 1000*60*10 : timeDelay;

      // console.log('message.id');
      // console.log(message.id);
      // console.log(agency);
      // console.log(timeDelay);
      // console.log('Created:');
      // console.log(message.msg_created_at);
      // console.log('When delayed:');
      // console.log(new Date(currentTime.getTime() - timeDelay));
      // console.log(msgCreatedAt < new Date(currentTime.getTime() - timeDelay));
      // console.log('');

      return msgCreatedAt < new Date(currentTime.getTime() - delay);
    }));

    const preparedArr = messages
      .filter((message, index) => filteredMessages[index] && !message.isCounted)
      .map((message) => ({
        id: message.id,
        msg_created_at: message.msg_created_at,
        isCounted: message.isCounted
      }));

    for (const unreadMessage of preparedArr) {
      const message = await this.messagesRepository.findOneBy({
        id: unreadMessage.id,
      });
      message.isCounted = true;

      const incident = new Incident();
      incident.ofId = message.ofId;
      incident.msgId = message.msgId;
      incident.type = TIncident.Message;
      incident.agencyId = message.agencyId;
      incident.stopWords = '';
      incident.managerId = message.managerId;

      let createdDate = new Date();
      createdDate.setHours(createdDate.getHours());
      incident.incident_created_at = createdDate.toISOString();

      await this.incidentsRepository.save(incident).then(async (data) => {
        await this.messagesRepository.save(message);
      });
    }
  }

  @Cron('*/20 * * * * *')
  async handleIncidentsCron() {
    console.log('chron handleIncidentsCron');
    const incidents = await this.incidentsRepository.findBy({
      isCounted: false,
    });

    for (const incident of incidents) {
      try {
        await this.incidentsRepository.update({ id: incident.id }, {
          isCounted: true
        });

        const agency = await this.agenciesRepository.findOneBy({
          id: incident.agencyId,
        });

        await this.notificationService.OnIncident(agency, incident);
      } catch (error) {
        console.error(`Err incident: ${error}`);
      }
    }
  }
}
