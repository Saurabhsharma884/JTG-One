import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AISuggestionDocument = HydratedDocument<AISuggestion>;

@Schema({ timestamps: true })
export class AISuggestion {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true, index: true }) employeeId: Types.ObjectId;
  @Prop({ type: Date, default: Date.now }) generatedAt: Date;
  @Prop({ type: Object }) sheetDataSnapshot: any;
  @Prop({ default: '' }) targetDesignation: string;
  @Prop({ type: [String], default: [] }) suggestedGoals: string[];
  @Prop({ type: Array, default: [] }) skillGaps: any[];
  @Prop({ type: Array, default: [] }) recommendedLearningPath: any[];
  @Prop({ type: [String], default: [] }) projectExposureSuggestions: string[];
  @Prop({ default: '' }) timelineForImprovement: string;
  @Prop({ default: '' }) confidenceSummary: string;
  @Prop({ default: '' }) reasoningSummary: string;
  @Prop({ default: 'processing', enum: ['processing', 'completed', 'failed'] }) status: string;
  @Prop() errorMessage?: string;
}
export const AISuggestionSchema = SchemaFactory.createForClass(AISuggestion);
