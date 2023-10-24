import { Test, TestingModule } from '@nestjs/testing';
import { OnlyFansController } from './only-fans.controller';

describe('OnlyFansController', () => {
  let controller: OnlyFansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnlyFansController],
    }).compile();

    controller = module.get<OnlyFansController>(OnlyFansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
