import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IMappingData extends MappingData, Document { }

@Schema({ timestamps: true, versionKey: false })
export class MappingData {
    @Prop()
    collectionName: string;

    @Prop({
        type: Object,
    })
    fields: Record<string, string[]>;

    constructor() {
        this.collectionName = '';
        this.fields = {};
    }
}

export const MappingDataSchema = SchemaFactory.createForClass(MappingData);