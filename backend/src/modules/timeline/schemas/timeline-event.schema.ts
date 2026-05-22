import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TimelineEventDocument = HydratedDocument<TimelineEvent>;

export enum TimelineEventType {
  JOINING = 'joining', PROJECT_ASSIGNMENT = 'project_assignment', RAMPUP_MILESTONE = 'rampup_milestone',
  FEEDBACK_IMPORT = 'feedback_import', ACHIEVEMENT = 'achievement', SKILL_UPDATE = 'skill_update',
  DESIGNATION_CHANGE = 'designation_change', CERTIFICATION = 'certification', PROJECT_TRANSITION = 'project_transition',
}

@Schema({ timestamps: true })
export class TimelineEvent {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true, index: true }) employeeId: Types.ObjectId;
  @Prop({ type: String, enum: TimelineEventType, required: true }) type: TimelineEventType;
  @Prop({ required: true }) title: string;
  @Prop({ default: '' }) description: string;
  @Prop({ type: Object, default: {} }) metadata: Record<string, any>;
  @Prop({ type: Date, required: true }) date: Date;
}
export const TimelineEventSchema = SchemaFactory.createForClass(TimelineEvent);
