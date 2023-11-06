import { Controller, Get, Param, Query } from '@nestjs/common';
import { IncidentService } from './incident.service';

@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get()
  incidentController() {
    return 'incident controller working';
  }

  @Get(':id')
  findAll(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    return this.incidentService.findAll(id, parsedStartDate, parsedEndDate);
  }
}
