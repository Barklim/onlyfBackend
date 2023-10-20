import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthenticationService } from './google-authentication.service';

describe('GoogleAuthenticationService', () => {
  let service: GoogleAuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleAuthenticationService],
    }).compile();

    service = module.get<GoogleAuthenticationService>(GoogleAuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
