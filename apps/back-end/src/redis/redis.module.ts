// redis.module.ts
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule as IORedisModule } from '@svtslv/nestjs-ioredis';
import { ConfigService } from '@nestjs/config';
import { EnvConfigModule } from '../config/config.module';

@Module({
    imports: [
        EnvConfigModule,
        IORedisModule.forRootAsync({
            imports: [EnvConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                config: {
                    host: configService.get<string>('REDIS_HOST', 'localhost'),
                    port: configService.get<number>('REDIS_PORT', 6379),
                },
            }),
        }),
    ],
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule { }
