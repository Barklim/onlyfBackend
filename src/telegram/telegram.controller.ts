import { Controller, Get } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  // @Get()
  // telegramController() {
  //   this.telegramService.sendToChat(process.env.TELEGRAM_CHAT_ID,'hello')
  //   return 'telegram controller working';
  // }
}
