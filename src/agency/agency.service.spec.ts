import { Test, TestingModule } from '@nestjs/testing';
import { AgencyService } from './agency.service';

describe('AgencyService', () => {
  let service: AgencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyService],
    }).compile();

    service = module.get<AgencyService>(AgencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
