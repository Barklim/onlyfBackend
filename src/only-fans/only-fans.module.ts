import { Module } from '@nestjs/common';
import { OnlyFansController } from './only-fans.controller';
import { OnlyFansService } from './only-fans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scrapper } from '../scrapper/entities/scrapper.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scrapper])],
  controllers: [OnlyFansController],
  providers: [OnlyFansService]
})
export class OnlyFansModule {}
