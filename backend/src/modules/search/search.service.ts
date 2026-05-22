import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from '../employee/schemas/employee.schema';
import { Role } from '../../common/enums/role.enum';
import { VisibilityLevel, ALWAYS_VISIBLE_FIELDS, CONFIGURABLE_FIELDS } from '../../common/enums/visibility.enum';

@Injectable()
export class SearchService {
  constructor(@InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>) {}

  async searchPeople(query: any, viewerId?: string, viewerRole?: string) {
    const filter: any = {};
    if (query.q) filter.$or = [{ name: { $regex: query.q, $options: 'i' } }, { email: { $regex: query.q, $options: 'i' } }];
    if (query.skills) {
      const skillsArray = query.skills.split(',').map((s: string) => s.trim());
      filter.skills = { $in: skillsArray.map((s: string) => new RegExp(s, 'i')) };
    }
    if (query.project) filter.currentProject = { $regex: query.project, $options: 'i' };
    if (query.designation) filter.designation = { $regex: query.designation, $options: 'i' };

    const employees = await this.employeeModel.find(filter).exec();
    return employees.map(emp => this.applyVisibilityFilters(emp, viewerId, viewerRole as Role));
  }

  private applyVisibilityFilters(employee: EmployeeDocument, viewerId?: string, viewerRole?: Role) {
    const isOwner = viewerId === employee.id;
    const isChampion = viewerRole === Role.CHAMPION;
    const rawData = employee.toObject();
    if (isOwner) return rawData;

    const filteredData: any = { _id: rawData._id, email: rawData.email };
    for (const field of ALWAYS_VISIBLE_FIELDS) filteredData[field] = rawData[field as keyof Employee];
    for (const field of CONFIGURABLE_FIELDS) {
      const setting = employee.visibilitySettings[field as keyof typeof employee.visibilitySettings];
      if (setting === VisibilityLevel.PUBLIC || (setting === VisibilityLevel.SHARED && isChampion)) {
         filteredData[field] = rawData[field as keyof Employee];
      }
    }
    return filteredData;
  }
}
