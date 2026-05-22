import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from '../employee/schemas/employee.schema';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';

@Injectable()
export class VisibilityService {
  constructor(@InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>) {}

  async getVisibilitySettings(employeeId: string) {
    const employee = await this.employeeModel.findById(employeeId).select('visibilitySettings').exec();
    if (!employee) throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    return employee.visibilitySettings;
  }

  async updateVisibilitySettings(employeeId: string, dto: UpdateVisibilityDto) {
    const updateObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(dto)) updateObj[`visibilitySettings.${key}`] = value;
    const employee = await this.employeeModel.findByIdAndUpdate(employeeId, { $set: updateObj }, { new: true }).select('visibilitySettings').exec();
    if (!employee) throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    return employee.visibilitySettings;
  }
}
