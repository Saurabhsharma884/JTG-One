import { IsString, IsNotEmpty, IsObject, IsBoolean, IsOptional, IsMongoId } from 'class-validator';
import { AnalyticsData } from '../schemas/feedback-import.schema';

export class CreateFeedbackImportDto {
  @IsMongoId() @IsNotEmpty() employeeId: string;
  @IsString() @IsNotEmpty() label: string;
  @IsBoolean() @IsOptional() isLatest?: boolean;
  @IsObject() @IsNotEmpty() analyticsData: AnalyticsData;
}
