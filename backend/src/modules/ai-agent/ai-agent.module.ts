import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AiAgentController } from './ai-agent.controller';
import { AiAgentService } from './ai-agent.service';
import { McpClientService } from './mcp-client.service';
import { AISuggestion, AISuggestionSchema } from './schemas/ai-suggestion.schema';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: AISuggestion.name, schema: AISuggestionSchema }, { name: Employee.name, schema: EmployeeSchema }])],
  controllers: [AiAgentController],
  providers: [AiAgentService, McpClientService],
  exports: [AiAgentService],
})
export class AiAgentModule {}
