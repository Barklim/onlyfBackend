import { Test, TestingModule } from '@nestjs/testing';
import { IncidentController } from './incident.controller';

describe('IncidentController', () => {
  let controller: IncidentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentController],
    }).compile();

    controller = module.get<IncidentController>(IncidentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
