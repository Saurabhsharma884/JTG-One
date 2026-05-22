import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FeedbackImport, FeedbackImportDocument } from './schemas/feedback-import.schema';
import { CreateFeedbackImportDto } from './dto/create-feedback-import.dto';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel(FeedbackImport.name) private feedbackImportModel: Model<FeedbackImportDocument>) {}

  async create(dto: CreateFeedbackImportDto): Promise<FeedbackImport> {
    const employeeId = new Types.ObjectId(dto.employeeId);
    if (dto.isLatest) await this.feedbackImportModel.updateMany({ employeeId }, { $set: { isLatest: false } }).exec();
    return new this.feedbackImportModel({ ...dto, employeeId }).save();
  }

  async findLatestByEmployeeId(employeeId: string): Promise<FeedbackImport> {
    const latest = await this.feedbackImportModel.findOne({ employeeId: new Types.ObjectId(employeeId), isLatest: true }).exec();
    if (!latest) {
      const mostRecent = await this.feedbackImportModel.findOne({ employeeId: new Types.ObjectId(employeeId) }).sort({ importedAt: -1 }).exec();
      if (!mostRecent) throw new NotFoundException(`No feedback found for employee ${employeeId}`);
      return mostRecent;
    }
    return latest;
  }

  async findAllByEmployeeId(employeeId: string): Promise<FeedbackImport[]> {
    return this.feedbackImportModel.find({ employeeId: new Types.ObjectId(employeeId) }).sort({ importedAt: -1 }).exec();
  }

  async findOne(id: string): Promise<FeedbackImport> {
     const feedback = await this.feedbackImportModel.findById(id).exec();
     if (!feedback) throw new NotFoundException(`Feedback with ID ${id} not found`);
     return feedback;
  }

  async remove(id: string): Promise<void> {
    const result = await this.feedbackImportModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Feedback with ID ${id} not found`);
  }
}
