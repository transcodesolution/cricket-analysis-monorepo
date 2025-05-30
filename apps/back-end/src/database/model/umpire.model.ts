import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Country, UmpireSubType, UmpireType } from '@cricket-analysis-monorepo/constants';

@Schema({ timestamps: true, versionKey: false })
export class Umpire {
  @Prop()
  name: string;

  @Prop({ type: String, enum: UmpireType })
  type: UmpireType;

  @Prop({ type: String, enum: UmpireSubType })
  subType: UmpireSubType;

  @Prop({ type: String, enum: Country })
  country: Country;

  @Prop()
  dob: string;

  @Prop({ type: String, index: true })
  uniqueId: string;

  constructor() {
    this.name = '';
    this.type = UmpireType.onfield;
    this.subType = UmpireSubType.BOWLER_END;
    this.country = Country.India;
    this.dob = "";
  }
}

export const UmpireSchema = SchemaFactory.createForClass(Umpire);