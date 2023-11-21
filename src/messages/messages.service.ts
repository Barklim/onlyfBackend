import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/entities/user.entity';
import { subHours, format } from 'date-fns';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly messagesRepository: Repository<Message>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ){}

  async createOne(id: string, createMessageDto: CreateMessageDto) {
    try {
      const message = new Message();
      message.ofId = id;
      message.msg_created_at = createMessageDto.msg_created_at;
      message.msgId = createMessageDto.msgId;
      message.chatId = createMessageDto.chatId;
      message.fromUserId = createMessageDto.fromUserId;
      message.text = createMessageDto.text.substring(0, 30);

      await this.messagesRepository.save(message);
      return 'create'
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async createMany(id: string, createMessageDto: Array<CreateMessageDto>) {
    return 'create many messages';
  }

  async update(token: string, id: string, updateMessageDto: Array<UpdateMessageDto>) {
    try {
      const refreshTokenData = jwt.decode(token) as { email: string };
      const email = refreshTokenData.email;
      const user = await this.usersRepository.findOneBy({
        email: email,
      })
      if (!user.agencyId) {
        throw new ConflictException('User have not agency!');
      }

      for (const message of updateMessageDto) {
        const existingMessage = await this.messagesRepository.findOneBy({
          msgId: message.msgId,
          ofId: id,
        });

        if (!existingMessage) {
          const newMessage = new Message();
          newMessage.ofId = id;
          newMessage.msg_created_at = message.msg_created_at;
          newMessage.msgId = message.msgId;
          newMessage.chatId = message.chatId;
          newMessage.fromUserId = message.fromUserId;
          newMessage.agencyId = user.agencyId;
          newMessage.text = message.text.substring(0, 30);
          newMessage.isRead = message.isRead
          newMessage.managerId = user.id;

          await this.messagesRepository.save(newMessage);
        } else {
          existingMessage.text = message.text.substring(0, 30);
          existingMessage.isRead = message.isRead;
          // TODO: remove. For testing
          existingMessage.msg_created_at = message.msg_created_at;
          existingMessage.fromUserId = message.fromUserId;

          await this.messagesRepository.save(existingMessage);
        }
      }
    } catch (err) {
      throw err;
    }
    return 'update successfully';
  }

  async findAll(id: string) {
    const existingMessage = await this.messagesRepository.findBy({
      ofId: id,
    });

    return existingMessage;
  }

  async findAllBy(managerId: string) {
    const findObj = {}
    if (managerId) { findObj['managerId'] = managerId }

    const existingMessage = await this.messagesRepository.findBy(findObj);

    return existingMessage;
  }

  async findActiveDialog(id: string, startDate: Date, endDate: Date, mc: number, uc: number): Promise<{ totalFromModel: number, totalFromUser: number, totalActive: number, chats: any[] }> {
    const existingMessages: Message[] = await this.messagesRepository.findBy({
      ofId: id,
    });

    const filteredMessages: Message[] = existingMessages.filter((message) => {
      const msgCreatedAt = new Date(message.msg_created_at);
      return msgCreatedAt >= startDate && msgCreatedAt <= endDate;
    });

    const groupedMessages: Record<string, { chatId: string, fromModel: number, fromUser: number, isActive: boolean }> = filteredMessages.reduce((result, message) => {
      if (!result[message.chatId]) {
        result[message.chatId] = {
          chatId: message.chatId,
          fromModel: 0,
          fromUser: 0,
          isActive: false
        };
      }


      if (message.fromUserId === id) {
        result[message.chatId].fromModel++;
      } else {
        result[message.chatId].fromUser++;
      }

      if (result[message.chatId].fromModel >= mc && result[message.chatId].fromUser >= uc) {
        result[message.chatId].isActive = true;
      }

      return result;
    }, {});

    const chats: { chatId: string, fromModel: number, fromUser: number, isActive: boolean }[] = Object.values(groupedMessages);

    const sumObject = chats.reduce((result, chat) => {
      result.totalFromModel = (result.totalFromModel || 0) + chat.fromModel;
      result.totalFromUser = (result.totalFromUser || 0) + chat.fromUser;
      result.totalActive = chat.isActive ? result.totalActive + 1 : result.totalActive;
      return result;
    }, { totalFromModel: 0, totalFromUser: 0, totalActive: 0 });

    return {
      totalFromModel: sumObject.totalFromModel,
      totalFromUser: sumObject.totalFromUser,
      totalActive: sumObject.totalActive,
      chats,
    };
  }

  async findActiveDialogs(id: string, mc: number, uc: number, tz: number): Promise<{ date: string, dayOfYear: string, type: number, totalFromModel: number, totalFromUser: number, totalActive: number, chats: any[] }[]> {
    const existingMessages: Message[] = await this.messagesRepository.findBy({
      ofId: id,
    });

    const filteredMessages: Message[] = existingMessages;

    const groupedMessages: Record<string, { dayOfYear: string, type: number, chatId: string, fromModel: number, fromUser: number, isActive: boolean }[]> = filteredMessages.reduce((result, message) => {
      const messageDateInit = new Date(message.msg_created_at);
      const messageDate = subHours(messageDateInit, tz);

      const type = Math.ceil((messageDate.getHours() + 1) / 8);

      const startOfYear = new Date(messageDate.getFullYear(), 0, 1);
      const diffInDays = Math.floor((messageDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
      const dayOfYear = diffInDays < 10 ? '0' + diffInDays : diffInDays.toString();

      if (!result[messageDate.toISOString().split('T')[0]]) {
        result[messageDate.toISOString().split('T')[0]] = [];
      }

      const existingChat = result[messageDate.toISOString().split('T')[0]].find(chat => chat.chatId === message.chatId);

      if (!existingChat) {
        const newChat = {
          type,
          chatId: message.chatId,
          fromModel: 0,
          fromUser: 0,
          isActive: false,
        };
        result[messageDate.toISOString().split('T')[0]].push({ dayOfYear, ...newChat });
      }

      const chatToUpdate = result[messageDate.toISOString().split('T')[0]].find(chat => chat.chatId === message.chatId);

      chatToUpdate.dayOfYear = Number(dayOfYear);

      if (message.fromUserId === id) {
        chatToUpdate.fromModel++;
      } else {
        chatToUpdate.fromUser++;
      }

      if (chatToUpdate.fromModel >= mc && chatToUpdate.fromUser >= uc) {
        chatToUpdate.isActive = true;
      }

      return result;
    }, {});

    const resultArray: { date: string, dayOfYear: string, type: number, totalFromModel: number, totalFromUser: number, totalActive: number, chats: any[] }[] = [];

    for (const [date, chats] of Object.entries(groupedMessages)) {
      const sumObject = chats.reduce((result, chat) => {
        result.totalFromModel = (result.totalFromModel || 0) + chat.fromModel;
        result.totalFromUser = (result.totalFromUser || 0) + chat.fromUser;
        result.totalActive = chat.isActive ? result.totalActive + 1 : result.totalActive;
        return result;
      }, { totalFromModel: 0, totalFromUser: 0, totalActive: 0 });

      resultArray.push({
        date,
        dayOfYear: chats[0].dayOfYear,
        type: chats[0].type,
        totalFromModel: sumObject.totalFromModel,
        totalFromUser: sumObject.totalFromUser,
        totalActive: sumObject.totalActive,
        chats,
      });
    }

    return resultArray;
  }

}
