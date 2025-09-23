import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MappingData } from '../database/model/mapping.model';
import { MAPPED_SHEET_KEY_DATA } from './provider/mapped-sheet-key-data';

@Injectable()
export class MappingDefaultSheetKeySeederService {
  constructor(@InjectModel(MappingData.name) private readonly mappedDataModel: Model<MappingData>) { }

  async defaultMappedDataToDb() {
    const checkMappedDataCollectionIsEmpty = await this.mappedDataModel.find();
    if (checkMappedDataCollectionIsEmpty.length === 0) {
      await this.mappedDataModel.insertMany(MAPPED_SHEET_KEY_DATA);
    }
  }
}