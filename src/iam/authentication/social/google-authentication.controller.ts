import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleTokenDto } from '../dto/google-token.dto';
import { AuthType } from '../enums/auth-type.enum';
import { Auth } from '../decorators/auth.decorator';

@Auth(AuthType.None)
@Controller('authentication/google')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthService: GoogleAuthenticationService,
  ) {}

  @Post()
  authenticate(@Body() tokenDto: GoogleTokenDto) {
    return this.googleAuthService.authenticate(tokenDto.token);
  }
}