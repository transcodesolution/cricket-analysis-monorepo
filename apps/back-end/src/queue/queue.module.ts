import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EnvConfigModule } from '../config/config.module';
import { AuthenticateUserRequest } from '../helper/jwt.helper';
import { CommonHelperService } from '../helper/common.helper';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileUploadConsumer } from './file-upload.consumer';
import { DataIngestionModule } from '../data-ingestion/data-ingestion.module';
import { SocketModule } from '../socket/socket.module';
import { RedisModule } from '../redis/redis.module';

@Module({
    imports: [DatabaseModule, EnvConfigModule, BullModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            connection: {
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
            },
        }),
        inject: [ConfigService],
    }), DataIngestionModule, SocketModule, RedisModule],
    controllers: [],
    providers: [FileUploadConsumer, AuthenticateUserRequest, CommonHelperService]
})
export class QueueModule { }
