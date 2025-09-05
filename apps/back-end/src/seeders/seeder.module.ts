import { Module } from '@nestjs/common';
import { MappingDefaultSheetKeySeederService } from './mapping-seeder.service';
import { DatabaseModule } from '../database/database.module';
import { RedisModule } from '../redis/redis.module';
import { DefaultEntityNameSeederService } from './default-entity-naming.service';

@Module({
  imports: [DatabaseModule, RedisModule],
  providers: [MappingDefaultSheetKeySeederService, DefaultEntityNameSeederService],
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
