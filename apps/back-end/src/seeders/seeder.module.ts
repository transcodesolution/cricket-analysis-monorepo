import { Module } from '@nestjs/common';
import { MappingDefaultSheetKeySeederService } from './mapping-seeder.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MappingDefaultSheetKeySeederService],
})
export class SeederModule {
  constructor(
    private readonly mappingSeederService: MappingDefaultSheetKeySeederService,
  ) {
    this.mappingSeederService.defaultMappedDataToDb();
  }
}
