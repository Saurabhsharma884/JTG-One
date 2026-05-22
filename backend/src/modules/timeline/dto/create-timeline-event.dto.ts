import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject, IsDateString, IsMongoId } from 'class-validator';
import { TimelineEventType } from '../schemas/timeline-event.schema';

export class CreateTimelineEventDto {
  @IsMongoId() @IsNotEmpty() employeeId: string;
  @IsEnum(TimelineEventType) @IsNotEmpty() type: TimelineEventType;
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsOptional() description?: string;
  @IsObject() @IsOptional() metadata?: Record<string, any>;
  @IsDateString() @IsNotEmpty() date: Date;
}
