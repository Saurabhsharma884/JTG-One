import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':id/dashboard') getDashboardData(@Param('id') id: string) { return this.profileService.getDashboardData(id); }
  @Get(':id') getProfile(@Param('id') id: string) { return this.profileService.getProfile(id); }
}
