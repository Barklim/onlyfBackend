import { Test, TestingModule } from '@nestjs/testing';
import { OnlyFansService } from './only-fans.service';

describe('OnlyFansService', () => {
  let service: OnlyFansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlyFansService],
    }).compile();

    service = module.get<OnlyFansService>(OnlyFansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
