import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthenticationController } from './google-authentication.controller';

describe('GoogleAuthenticationController', () => {
  let controller: GoogleAuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleAuthenticationController],
    }).compile();

    controller = module.get<GoogleAuthenticationController>(GoogleAuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
