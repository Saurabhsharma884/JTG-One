import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackImportDto } from './dto/create-feedback-import.dto';

@Controller('api/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}
  @Post('import') create(@Body() createFeedbackImportDto: CreateFeedbackImportDto) { return this.feedbackService.create(createFeedbackImportDto); }
  @Get('latest/:employeeId') findLatestByEmployeeId(@Param('employeeId') employeeId: string) { return this.feedbackService.findLatestByEmployeeId(employeeId); }
  @Get('history/:employeeId') findAllByEmployeeId(@Param('employeeId') employeeId: string) { return this.feedbackService.findAllByEmployeeId(employeeId); }
  @Get(':id') findOne(@Param('id') id: string) { return this.feedbackService.findOne(id); }
  @Delete(':id') remove(@Param('id') id: string) { return this.feedbackService.remove(id); }
}
