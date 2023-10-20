import { Test, TestingModule } from '@nestjs/testing';
import { OptAuthenticationService } from './opt-authentication.service';

describe('OptAuthenticationService', () => {
  let service: OptAuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptAuthenticationService],
    }).compile();

    service = module.get<OptAuthenticationService>(OptAuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
