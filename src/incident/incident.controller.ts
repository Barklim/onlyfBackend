import { Controller, Get, Param, Query } from '@nestjs/common';
import { IncidentService } from './incident.service';

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
    @Query('managerId') managerId: string,
  ) {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    return this.incidentService.findAll(ofId, managerId, parsedStartDate, parsedEndDate);
  }
}
