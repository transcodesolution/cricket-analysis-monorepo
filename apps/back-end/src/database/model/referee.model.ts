import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Referee {
  @Prop()
  name: string;

  @Prop({ type: String, index: true })
  uniqueId: string;

  constructor() {
    this.name = '';
  }
}

export const RefereeSchema = SchemaFactory.createForClass(Referee);