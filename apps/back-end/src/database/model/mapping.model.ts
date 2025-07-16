import { MatchFormat, TournamentName, TournamentType } from '@cricket-analysis-monorepo/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Document } from 'mongoose';

export interface IMappingData extends MappingData, Document { }

export class CachedInput {
    @Prop()
    @IsNotEmpty()
    @IsString()
    referenceKey: string;

    @Prop()
    @IsNotEmpty()
    @IsString()
    referenceValue: string;

    @Prop({ type: String, enum: TournamentType })
    @IsOptional()
    @IsEnum(TournamentType)
    type: TournamentType;

    @Prop({ type: String, enum: TournamentName })
    @IsOptional()
    @IsEnum(TournamentName)
    event?: TournamentName;

    @Prop({ type: String, enum: MatchFormat })
    @IsOptional()
    @IsEnum(MatchFormat)
    matchFormat: MatchFormat;

    @IsString()
    collectionName?: string;
}

@Schema({ timestamps: true, versionKey: false })
export class MappingData {
    @Prop()
    collectionName: string;

    @Prop({
        type: Object,
    })
    fields: Record<string, string[]>;

    @Prop({
        type: [CachedInput],
    })
    inputs?: CachedInput[];

    constructor() {
        this.collectionName = '';
        this.fields = {};
    }
}

export const MappingDataSchema = SchemaFactory.createForClass(MappingData);