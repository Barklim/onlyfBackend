import { Module } from '@nestjs/common';
import { OnlyFansController } from './only-fans.controller';
import { OnlyFansService } from './only-fans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scrapper } from '../scrapper/entities/scrapper.entity';
import { Message } from '../messages/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scrapper, Message])],
  controllers: [OnlyFansController],
  providers: [OnlyFansService]
})
export class OnlyFansModule {}
