import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';

@Module({
  providers: [TelegramService],
  controllers: [TelegramController]
})
export class TelegramModule {}
