import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TimelineEvent, TimelineEventDocument } from './schemas/timeline-event.schema';
import { CreateTimelineEventDto } from './dto/create-timeline-event.dto';

@Injectable()
export class TimelineService {
  constructor(@InjectModel(TimelineEvent.name) private timelineEventModel: Model<TimelineEventDocument>) {}

  async create(dto: CreateTimelineEventDto): Promise<TimelineEvent> {
    const event = new this.timelineEventModel({ ...dto, employeeId: new Types.ObjectId(dto.employeeId) });
    return event.save();
  }

  async findByEmployeeId(employeeId: string): Promise<TimelineEvent[]> {
    return this.timelineEventModel.find({ employeeId: new Types.ObjectId(employeeId) }).sort({ date: -1 }).exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.timelineEventModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Timeline event with ID ${id} not found`);
  }
}
