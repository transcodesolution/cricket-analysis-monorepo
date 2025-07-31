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
import { RedisModule } from '../redis/redis.module';
import { SocketModule } from '../socket/socket.module';
import { PlayerUpdateScriptService } from './script';

@Module({
  imports: [DatabaseModule, EnvConfigModule, BullModule.registerQueue({
    name: QUEUES.fileUpload,
  }), RedisModule, SocketModule],
  controllers: [DataIngestionController],
  providers: [DataIngestionService, AnalyticsService, AuthenticateUserRequest, CommonHelperService, PlayerUpdateScriptService],
  exports: [DataIngestionService]
})
export class DataIngestionModule { }
