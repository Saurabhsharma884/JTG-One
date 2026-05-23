import { Controller, Post, Get, Param, Body, NotFoundException } from '@nestjs/common';
import { FeedbackAnalysisService } from './feedback-analysis.service';

@Controller('api/feedback-analysis/tasks')
export class FeedbackAnalysisController {
  constructor(private readonly feedbackAnalysisService: FeedbackAnalysisService) {}

  @Post()
  async createTask(@Body('employeeId') employeeId: string) {
    if (!employeeId) {
      throw new NotFoundException('employeeId is required');
    }
    return this.feedbackAnalysisService.createTask(employeeId);
  }

  @Get(':taskId')
  getTaskStatus(@Param('taskId') taskId: string) {
    return this.feedbackAnalysisService.getTaskStatus(taskId);
  }
}
