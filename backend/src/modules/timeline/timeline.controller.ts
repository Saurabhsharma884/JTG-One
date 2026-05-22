import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { CreateTimelineEventDto } from './dto/create-timeline-event.dto';

@Controller('api/timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}
  @Post() create(@Body() createTimelineEventDto: CreateTimelineEventDto) { return this.timelineService.create(createTimelineEventDto); }
  @Get(':employeeId') findByEmployeeId(@Param('employeeId') employeeId: string) { return this.timelineService.findByEmployeeId(employeeId); }
  @Delete(':id') remove(@Param('id') id: string) { return this.timelineService.remove(id); }
}
