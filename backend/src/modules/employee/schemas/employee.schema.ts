import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';
import { VisibilityLevel } from '../../../common/enums/visibility.enum';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema({ timestamps: true })
export class VisibilitySettings {
  @Prop({ type: String, enum: VisibilityLevel, default: VisibilityLevel.PUBLIC }) pastProjects: VisibilityLevel;
  @Prop({ type: String, enum: VisibilityLevel, default: VisibilityLevel.PUBLIC }) achievements: VisibilityLevel;
  @Prop({ type: String, enum: VisibilityLevel, default: VisibilityLevel.PUBLIC }) strengths: VisibilityLevel;
  @Prop({ type: String, enum: VisibilityLevel, default: VisibilityLevel.SHARED }) timelineDetails: VisibilityLevel;
  @Prop({ type: String, enum: VisibilityLevel, default: VisibilityLevel.PUBLIC }) certifications: VisibilityLevel;
  @Prop({ type: String, enum: VisibilityLevel, default: VisibilityLevel.PUBLIC }) domainExperience: VisibilityLevel;
  @Prop({ type: String, enum: VisibilityLevel, default: VisibilityLevel.SHARED }) feedbackSummary: VisibilityLevel;
}
export const VisibilitySettingsSchema = SchemaFactory.createForClass(VisibilitySettings);

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) name: string;
  @Prop({ default: '' }) designation: string;
  @Prop({ default: '' }) currentProject: string;
  @Prop({ type: [String], default: [] }) skills: string[];
  @Prop({ type: [String], default: [] }) pastProjects: string[];
  @Prop({ type: [String], default: [] }) achievements: string[];
  @Prop({ type: [String], default: [] }) strengths: string[];
  @Prop({ type: [String], default: [] }) improvementAreas: string[];
  @Prop({ type: [String], default: [] }) weaknesses: string[];
  @Prop({ default: '' }) managerNotes: string;
  @Prop({ type: [String], default: [] }) certifications: string[];
  @Prop({ type: [String], default: [] }) domainExperience: string[];
  @Prop({ type: Date }) inductionDate: Date;
  @Prop({ type: String, enum: Role, default: Role.EMPLOYEE }) role: Role;
  @Prop({ type: VisibilitySettingsSchema, default: () => ({}) }) visibilitySettings: VisibilitySettings;
  @Prop({ default: 0 }) profileCompleteness: number;
}
export const EmployeeSchema = SchemaFactory.createForClass(Employee);
