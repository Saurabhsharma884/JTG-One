import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { FeedbackImport, FeedbackImportSchema } from './schemas/feedback-import.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: FeedbackImport.name, schema: FeedbackImportSchema }])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
