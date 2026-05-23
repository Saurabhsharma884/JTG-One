import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employee, EmployeeDocument } from '../employee/schemas/employee.schema';
import { TimelineEvent, TimelineEventDocument } from '../timeline/schemas/timeline-event.schema';
import { FeedbackImport, FeedbackImportDocument } from '../feedback/schemas/feedback-import.schema';
import { AISuggestion, AISuggestionDocument } from '../ai-agent/schemas/ai-suggestion.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    @InjectModel(TimelineEvent.name) private timelineEventModel: Model<TimelineEventDocument>,
    @InjectModel(FeedbackImport.name) private feedbackImportModel: Model<FeedbackImportDocument>,
    @InjectModel(AISuggestion.name) private aiSuggestionModel: Model<AISuggestionDocument>,
  ) {}

  async getDashboardData(employeeId: string) {
    if (!Types.ObjectId.isValid(employeeId)) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
    const objectId = new Types.ObjectId(employeeId);
    const employee = await this.employeeModel.findById(objectId).lean().exec();
    if (!employee) throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    const timelineHighlights = await this.timelineEventModel.find({ employeeId: objectId }).sort({ date: -1 }).limit(5).lean().exec();
    const latestFeedback = await this.feedbackImportModel.findOne({ employeeId, isLatest: true }).lean().exec();
    const latestAISuggestion = await this.aiSuggestionModel.findOne({ employeeId: objectId }).sort({ generatedAt: -1 }).lean().exec();
    return { profile: employee, timelineHighlights, latestFeedback, latestAISuggestion };
  }

  async getProfile(employeeId: string) {
     if (!Types.ObjectId.isValid(employeeId)) throw new NotFoundException(`Employee not found`);
     const employee = await this.employeeModel.findById(employeeId).lean().exec();
     if (!employee) throw new NotFoundException(`Employee not found`);
     return employee;
  }
}
