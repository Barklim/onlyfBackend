import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../messages/entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Message) private readonly messagesRepository: Repository<Message>,
  ){}

  @Cron('*/5 * * * * *')
  async handleCron() {
    console.log('!!! chron');

    const currentTime = new Date();

    const fiveMinutes = 10*60*1000;

    const existingMessages = await this.messagesRepository.find();

    // We filter messages, leaving only those whose msg_created_at is less than the current time plus x minutes
    const filteredMessages = existingMessages.filter((message) => {
      const msgCreatedAt = new Date(message.msg_created_at);
      const test = new Date(currentTime.getTime() - fiveMinutes)
      // console.log(msgCreatedAt);
      // console.log(test);
      // if (message.id === 40) {
      //   console.log(msgCreatedAt < new Date(currentTime.getTime() - fiveMinutes));
      //   console.log(msgCreatedAt);
      //   console.log(test);
      // }

      return msgCreatedAt < new Date(currentTime.getTime() - fiveMinutes);
    });

    // const arr = filteredMessages.map((message) => ({
    //   id: message.id,
    //   msg_created_at: message.msg_created_at,
    //   // text: message.text,
    // }));
    // console.log(arr);
    // console.log('!!!');
  }
}
