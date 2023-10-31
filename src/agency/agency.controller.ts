import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { Request } from 'express';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Auth(AuthType.Bearer, AuthType.ApiKey)
@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Get()
  agencyController() {
    return 'agency controller working';
  }

  @Get('me')
  getMeController(@Req() request: Request) {
    const tokenParts = request.headers.authorization.split(' ');

    return this.agencyService.findMe(tokenParts[1]);
  }

  @Post()
  create(@Req() request: Request, @Body() createAgencyDto: CreateAgencyDto) {
    const tokenParts = request.headers.authorization.split(' ');

    return this.agencyService.createAgency(tokenParts[1], createAgencyDto);
  }

  @Patch()
  update(@Req() request: Request, @Body() updateAgencyDto: UpdateAgencyDto) {
    const tokenParts = request.headers.authorization.split(' ');

    return this.agencyService.update(tokenParts[1], updateAgencyDto);
  }
}
