import { Logger, Module } from '@nestjs/common';
import { EnvConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from './model';
@Module({
  imports: [MongooseModule.forRootAsync({
    imports: [EnvConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('DB_URL'),
      onConnectionCreate(connection) {
        connection.once('connected', () => {
          Logger.log("Database successfully connected");
        })

        connection.on('error', (error) => {
          Logger.error('❌ MongoDB connection error:', error);
        })

        connection.on('disconnected', () => {
          Logger.warn('⚠️ MongoDB disconnected');
        })

        return connection;
      },
    }),
    inject: [ConfigService],
  }), MongooseModule.forFeature(Model)],
  exports: [MongooseModule],
})
export class DatabaseModule { }