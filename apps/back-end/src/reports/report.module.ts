import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { EnvConfigModule } from '../config/config.module';
import { AuthenticateUserRequest } from '../helper/jwt.helper';
import { RedisModule } from '../redis/redis.module';

@Module({
    imports: [DatabaseModule, EnvConfigModule, RedisModule],
    controllers: [ReportController],
    providers: [ReportService, AuthenticateUserRequest]
})
export class ReportModule { }
