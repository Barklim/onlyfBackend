import { Module } from '@nestjs/common';
import { ScrapperController } from './scrapper.controller';
import { ScrapperService } from './scrapper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scrapper } from './entities/scrapper.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scrapper])],
  controllers: [ScrapperController],
  providers: [ScrapperService]
})
export class ScrapperModule {}
