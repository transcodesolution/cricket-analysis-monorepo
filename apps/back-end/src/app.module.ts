import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { DataIngestionModule } from './data-ingestion/data-ingestion.module';
import { SeederModule } from './seeders/seeder.module';
import { ReportModule } from './reports/report.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [EnvConfigModule, DatabaseModule, DataIngestionModule, SeederModule, ReportModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
