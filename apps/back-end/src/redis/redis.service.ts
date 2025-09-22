// redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    async onModuleInit() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
        });

        this.client.on('connect', () => {
            Logger.log('Connected to Redis');
        });

        this.client.on('error', (err) => {
            Logger.error('Redis connection error:', err);
        });
    }

    async onModuleDestroy() {
        await this.client.quit();
        console.log('Redis connection closed');
    }

    async set(key: string, value: string, timeoutInSeconds?: number): Promise<string> {
        if (timeoutInSeconds) {
            return this.client.set(key, value, 'EX', timeoutInSeconds);
        }
        return this.client.set(key, value);
    }

    async setList(key: string, value: string[]): Promise<void> {
        await this.client.rpush(key, ...value);
    }

    async lrange(key: string): Promise<string[]> {
        return this.client.lrange(key, 0, -1);
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async del(key: string): Promise<number> {
        return this.client.del(key);
    }
}