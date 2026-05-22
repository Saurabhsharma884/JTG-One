import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisibilityController } from './visibility.controller';
import { VisibilityService } from './visibility.service';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }])],
  controllers: [VisibilityController],
  providers: [VisibilityService],
  exports: [VisibilityService],
})
export class VisibilityModule {}
