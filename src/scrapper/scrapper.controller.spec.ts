import { Test, TestingModule } from '@nestjs/testing';
import { ScrapperController } from './scrapper.controller';

describe('ScrapperController', () => {
  let controller: ScrapperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrapperController],
    }).compile();

    controller = module.get<ScrapperController>(ScrapperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
