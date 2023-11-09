import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScrapperDto } from './dto/create-scrapper.dto';
import { Scrapper } from './entities/scrapper.entity';
import { UpdateScrapperDto } from './dto/update-scrapper.dto';

@Injectable()
export class ScrapperService {
  constructor(
    @InjectRepository(Scrapper) private readonly scrappersRepository: Repository<Scrapper>,
  ){}

  async getScrappers() {
    return 'scrappers';
  }

  async create(createScrapperDto: CreateScrapperDto) {

    try {
      const scrapper = new Scrapper();
      scrapper.email = createScrapperDto.email;
      // scrapper.password = await this.hashingService.hash(createScrapperDto.password);
      scrapper.password = createScrapperDto.password;
      scrapper.ofId = createScrapperDto.ofId;

      await this.scrappersRepository.save(scrapper);
      return 'create'
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async findAllScrappers() {
    return this.scrappersRepository.find();
  }

  async findOne(id: string) {
    const scrapper = await this.scrappersRepository.findOneBy({
      id: id,
    });

    if (!scrapper) {
      throw new NotFoundException('Scrapper not found');
    }

    return scrapper;
  }

  async update(id: string, updateScrapperDto: UpdateScrapperDto) {
    const existingScrapper = await this.scrappersRepository.findOneBy({
      id: id,
    });

    if (!existingScrapper) {
      throw new NotFoundException('Scrapper not found');
    }

    existingScrapper.email = updateScrapperDto.email;
    existingScrapper.password = updateScrapperDto.password;
    existingScrapper.ofId = updateScrapperDto.ofId;

    await this.scrappersRepository.save(existingScrapper);

    return existingScrapper;
  }

  async remove(id: string) {
    const existingScrapper = await this.scrappersRepository.findOneBy({
      id: id,
    });

    if (!existingScrapper) {
      throw new NotFoundException('Scrapper not found');
    }

    await this.scrappersRepository.remove(existingScrapper);

    return 'Scrapper has been removed';
  }
}
