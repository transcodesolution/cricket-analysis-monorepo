import { Module } from '@nestjs/common';
import { DataIngestionService } from './data-ingestion.service';
import { DataIngestionController } from './data-ingestion.controller';
import { DatabaseModule } from '../database/database.module';
import { AnalyticsService } from './utils/analytics.service';
import { EnvConfigModule } from '../config/config.module';
import { AuthenticateUserRequest } from '../helper/jwt.helper';
import { CommonHelperService } from '../helper/common.helper';

@Module({
  imports: [DatabaseModule, EnvConfigModule],
  controllers: [DataIngestionController],
  providers: [DataIngestionService, AnalyticsService, AuthenticateUserRequest, CommonHelperService],
})
export class DataIngestionModule { }
