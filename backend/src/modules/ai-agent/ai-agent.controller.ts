import { Controller, Post, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';

@Controller('api/ai')
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}
  @Post('refresh/:employeeId') @HttpCode(HttpStatus.ACCEPTED) triggerRefresh(@Param('employeeId') employeeId: string) { return this.aiAgentService.triggerRefresh(employeeId); }
  @Get('suggestions/:employeeId') getLatestSuggestions(@Param('employeeId') employeeId: string) { return this.aiAgentService.getLatestSuggestions(employeeId); }
}
