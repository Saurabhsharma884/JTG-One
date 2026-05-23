import { Module } from '@nestjs/common';
import { FeedbackAnalysisController } from './feedback-analysis.controller';
import { FeedbackAnalysisService } from './feedback-analysis.service';
import { AiAgentModule } from '../ai-agent/ai-agent.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [AiAgentModule, FeedbackModule, EmployeeModule],
  controllers: [FeedbackAnalysisController],
  providers: [FeedbackAnalysisService],
})
export class FeedbackAnalysisModule {}
