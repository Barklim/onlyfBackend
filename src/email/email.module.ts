import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [EmailService, ConfigService],
  controllers: [EmailController]
})
export class EmailModule {}
