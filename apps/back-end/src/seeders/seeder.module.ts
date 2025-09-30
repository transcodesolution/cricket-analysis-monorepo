import { Module } from '@nestjs/common';
import { MappingDefaultSheetKeySeederService } from './mapping-seeder.service';
import { DatabaseModule } from '../database/database.module';
import { RedisModule } from '../redis/redis.module';
import { DefaultEntityNameSeederService } from './default-entity-naming.service';
import { AnalyticsReCalculationStartupScriptService } from './analytics-re-calculation-startup-script.service';
import { EnvConfigModule } from '../config/config.module';
import { DataIngestionModule } from '../data-ingestion/data-ingestion.module';

@Module({
  imports: [DatabaseModule, RedisModule, EnvConfigModule, DataIngestionModule],
  providers: [MappingDefaultSheetKeySeederService, DefaultEntityNameSeederService, AnalyticsReCalculationStartupScriptService],
})
export class SeederModule {
  constructor(
    private readonly mappingSeederService: MappingDefaultSheetKeySeederService,
    private readonly defaultEntityNameSeederService: DefaultEntityNameSeederService,
  ) {
    this.mappingSeederService.defaultMappedDataToDb();
    this.defaultEntityNameSeederService.defaultLoadEntityNameToRedis();
  }
}
