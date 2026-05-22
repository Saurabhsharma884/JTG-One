import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsArray() @IsString({ each: true }) @IsOptional() pastProjects?: string[];
  @IsArray() @IsString({ each: true }) @IsOptional() achievements?: string[];
  @IsArray() @IsString({ each: true }) @IsOptional() strengths?: string[];
  @IsArray() @IsString({ each: true }) @IsOptional() improvementAreas?: string[];
  @IsArray() @IsString({ each: true }) @IsOptional() weaknesses?: string[];
  @IsString() @IsOptional() managerNotes?: string;
  @IsArray() @IsString({ each: true }) @IsOptional() certifications?: string[];
  @IsArray() @IsString({ each: true }) @IsOptional() domainExperience?: string[];
}
