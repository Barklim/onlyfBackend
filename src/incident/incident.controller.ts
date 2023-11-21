import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { IncidentService } from './incident.service';
import { TIncident } from './enums/incident.enum';

@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get()
  incidentController() {
    return 'incident controller working';
  }

  @Get('report')
  findAll(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('ofId') ofId: string,
    @Query('type') type: string,
    @Query('managerId') managerId: string,
  ) {
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    return this.incidentService.findAll(ofId, managerId, type as unknown as TIncident, parsedStartDate, parsedEndDate);
  }

  @Post()
  create(@Req() request: Request, @Body() createIncident: any) {
    const tokenParts = request.headers.authorization.split(' ');

    return this.incidentService.createIncident(tokenParts[1], createIncident);
  }
}
