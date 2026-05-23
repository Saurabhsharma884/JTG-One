import { IsEmail, IsNotEmpty, IsString, IsOptional, IsArray, IsDateString, IsEnum } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

export class CreateEmployeeDto {
  @IsEmail() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() designation?: string;
  @IsString() @IsOptional() targetDesignation?: string;
  @IsString() @IsOptional() currentProject?: string;
  @IsArray() @IsString({ each: true }) @IsOptional() skills?: string[];
  @IsDateString() @IsOptional() inductionDate?: Date;
  @IsEnum(Role) @IsOptional() role?: Role;
}
