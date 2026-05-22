import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { VisibilityService } from './visibility.service';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';

@Controller('api/visibility')
export class VisibilityController {
  constructor(private readonly visibilityService: VisibilityService) {}
  @Get(':employeeId') getVisibilitySettings(@Param('employeeId') employeeId: string) { return this.visibilityService.getVisibilitySettings(employeeId); }
  @Put(':employeeId') updateVisibilitySettings(@Param('employeeId') employeeId: string, @Body() updateVisibilityDto: UpdateVisibilityDto) { return this.visibilityService.updateVisibilitySettings(employeeId, updateVisibilityDto); }
}
