import { IsEnum, IsOptional } from 'class-validator';
import { VisibilityLevel } from '../../../common/enums/visibility.enum';

export class UpdateVisibilityDto {
  @IsEnum(VisibilityLevel) @IsOptional() pastProjects?: VisibilityLevel;
  @IsEnum(VisibilityLevel) @IsOptional() achievements?: VisibilityLevel;
  @IsEnum(VisibilityLevel) @IsOptional() strengths?: VisibilityLevel;
  @IsEnum(VisibilityLevel) @IsOptional() timelineDetails?: VisibilityLevel;
  @IsEnum(VisibilityLevel) @IsOptional() certifications?: VisibilityLevel;
  @IsEnum(VisibilityLevel) @IsOptional() domainExperience?: VisibilityLevel;
  @IsEnum(VisibilityLevel) @IsOptional() feedbackSummary?: VisibilityLevel;
}
