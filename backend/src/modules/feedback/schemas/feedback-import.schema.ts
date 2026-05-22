import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FeedbackImportDocument = HydratedDocument<FeedbackImport>;

@Schema() export class CategoryScore { @Prop({ required: true }) category: string; @Prop({ required: true }) score: number; }
@Schema() export class FeedbackTrendPoint { @Prop({ required: true }) period: string; @Prop({ required: true }) score: number; }
@Schema() export class SkillRating { @Prop({ required: true }) skill: string; @Prop({ required: true }) rating: number; }
@Schema() export class RadarDataPoint { @Prop({ required: true }) axis: string; @Prop({ required: true }) value: number; }

@Schema()
export class AnalyticsData {
  @Prop({ type: [CategoryScore], default: [] }) categoryScores: CategoryScore[];
  @Prop({ type: [FeedbackTrendPoint], default: [] }) feedbackTrend: FeedbackTrendPoint[];
  @Prop({ type: [SkillRating], default: [] }) skillRatings: SkillRating[];
  @Prop({ type: [String], default: [] }) strengths: string[];
  @Prop({ type: [String], default: [] }) improvementAreas: string[];
  @Prop({ type: [RadarDataPoint], default: [] }) radarData: RadarDataPoint[];
  @Prop({ type: Object }) rawData: any;
}

@Schema({ timestamps: true })
export class FeedbackImport {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true, index: true }) employeeId: Types.ObjectId;
  @Prop({ type: Date, default: Date.now }) importedAt: Date;
  @Prop({ required: true }) label: string;
  @Prop({ default: false }) isLatest: boolean;
  @Prop({ type: AnalyticsData, default: () => ({}) }) analyticsData: AnalyticsData;
}
export const FeedbackImportSchema = SchemaFactory.createForClass(FeedbackImport);
