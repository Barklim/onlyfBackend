import { Module } from '@nestjs/common';
import { OnlyFansController } from './only-fans.controller';
import { OnlyFansService } from './only-fans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scrapper } from '../scrapper/entities/scrapper.entity';
import { Messages } from '../messages/entities/messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scrapper, Messages])],
  controllers: [OnlyFansController],
  providers: [OnlyFansService]
})
export class OnlyFansModule {}
