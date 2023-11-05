import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly mailingService: EmailService
  ) {}

  @Get('send-mail')
  public sendMail() {
    return this.mailingService.sendMail();
  }
}