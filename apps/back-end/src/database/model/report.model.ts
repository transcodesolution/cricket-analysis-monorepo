import { MatchFormat } from '@cricket-analysis-monorepo/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Player } from './player.model';
import { Venue } from './venue.model';

export class FilterConfiguration {
    @Prop({ type: SchemaTypes.ObjectId })
    @IsMongoId()
    id: string;

    @Prop({ type: MatchFormat })
    @IsString()
    @IsEnum(MatchFormat)
    @IsOptional()
    matchFormat?: MatchFormat;

    @Prop()
    @IsString()
    @IsOptional()
    overValue?: number;

    @Prop({ type: SchemaTypes.ObjectId, ref: Player.name })
    @IsString()
    @IsOptional()
    selectedPlayer?: string;

    @Prop({ type: [SchemaTypes.ObjectId], ref: Venue.name })
    @IsString({ each: true })
    @IsOptional()
    selectedVenues?: string[];

    @Prop({ type: Number })
    @IsNumber()
    @IsOptional()
    order: number;
}

@Schema({ timestamps: true, versionKey: false })
export class Report {
    @Prop({ type: String })
    name: string;

    @Prop({ type: String, index: true, unique: true })
    uniqueKey: string;

    @Prop({ type: String })
    query: string;

    @Prop({ type: String })
    collectionName: string;

    @Prop({ type: [FilterConfiguration] })
    filters: FilterConfiguration[];

    constructor() {
        this.name = "";
        this.query = "";
        this.collectionName = "";
        this.filters = [];
    }
}

export const ReportSchema = SchemaFactory.createForClass(Report);