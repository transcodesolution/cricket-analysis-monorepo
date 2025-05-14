import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { DataIngestionModule } from './data-ingestion/data-ingestion.module';
import { SeederModule } from './seeders/seeder.module';
import { ReportModule } from './reports/report.module';
import { AuthModule } from './auth/auth.module';
import { UserRoleModule } from './user-role/user-role.module';
import { UserModule } from './user/user.module';
import { PanelUserModule } from './panel-user/panel-user.module';

@Module({
  imports: [EnvConfigModule, DatabaseModule, DataIngestionModule, SeederModule, ReportModule, AuthModule, UserRoleModule, UserModule, PanelUserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
