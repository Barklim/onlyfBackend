import { Injectable } from '@nestjs/common';
const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService {
  private static bot: any;

  constructor() {
    if (!TelegramService.bot) {
      TelegramService.bot = new TelegramBot(process.env.TELEGRAM_API, { polling: true });
    }
  }

  async sendToChat(chatId: string, message: string) {
    await TelegramService.bot.sendMessage(chatId, message);
  }

  async sendNotificationTelegram(message: string) {
    await TelegramService.bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
  }
}