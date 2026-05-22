import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';
import { TimelineEvent, TimelineEventSchema } from '../timeline/schemas/timeline-event.schema';
import { FeedbackImport, FeedbackImportSchema } from '../feedback/schemas/feedback-import.schema';
import { AISuggestion, AISuggestionSchema } from '../ai-agent/schemas/ai-suggestion.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }, { name: TimelineEvent.name, schema: TimelineEventSchema }, { name: FeedbackImport.name, schema: FeedbackImportSchema }, { name: AISuggestion.name, schema: AISuggestionSchema }])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
