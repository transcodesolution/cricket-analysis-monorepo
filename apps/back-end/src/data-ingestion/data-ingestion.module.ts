import { Module } from '@nestjs/common';
import { DataIngestionService } from './data-ingestion.service';
import { DataIngestionController } from './data-ingestion.controller';
import { DatabaseModule } from '../database/database.module';
import { AnalyticsService } from './utils/analytics.service';
import { EnvConfigModule } from '../config/config.module';
import { AuthenticateUserRequest } from '../helper/jwt.helper';
import { CommonHelperService } from '../helper/common.helper';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../helper/constant.helper';

@Module({
  imports: [DatabaseModule, EnvConfigModule, BullModule.registerQueue({
    name: QUEUES.fileUpload,
  })],
  controllers: [DataIngestionController],
  providers: [DataIngestionService, AnalyticsService, AuthenticateUserRequest, CommonHelperService],
  exports: [DataIngestionService]
})
export class DataIngestionModule { }
