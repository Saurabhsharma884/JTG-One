import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import configuration from './config/configuration';

import { EmployeeModule } from './modules/employee/employee.module';
import { TimelineModule } from './modules/timeline/timeline.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { VisibilityModule } from './modules/visibility/visibility.module';
import { SearchModule } from './modules/search/search.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AiAgentModule } from './modules/ai-agent/ai-agent.module';
import { EventsModule } from './modules/events/events.module';
import { FeedbackAnalysisModule } from './modules/feedback-analysis/feedback-analysis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({ imports: [ConfigModule], useFactory: async (configService: ConfigService) => ({ uri: configService.get<string>('mongodb.uri') }), inject: [ConfigService] }),
    EventEmitterModule.forRoot(),
    EmployeeModule, TimelineModule, FeedbackModule, VisibilityModule, SearchModule, ProfileModule, AiAgentModule, EventsModule, FeedbackAnalysisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
