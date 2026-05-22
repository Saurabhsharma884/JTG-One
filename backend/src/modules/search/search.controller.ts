import { Controller, Get, Query, Headers } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get('people') searchPeople(@Query() query: any, @Headers('x-user-id') viewerId?: string, @Headers('x-user-role') viewerRole?: string) {
    return this.searchService.searchPeople(query, viewerId, viewerRole);
  }
}
