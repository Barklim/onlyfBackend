import { Test, TestingModule } from '@nestjs/testing';
import { IncidentService } from './incident.service';

describe('IncidentService', () => {
  let service: IncidentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentService],
    }).compile();

    service = module.get<IncidentService>(IncidentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
