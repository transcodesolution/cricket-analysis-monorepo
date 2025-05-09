import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

@Schema({ timestamps: true, versionKey: false })
export class ReportFilter {
    @Prop({ type: String })
    @IsNotEmpty()
    @IsString()
    label: string;

    @Prop({ type: String })
    @IsOptional()
    @IsString()
    collectionName: string;

    @Prop({ type: String })
    @IsNotEmpty()
    @IsString()
    queryToExecute: string;

    @Prop({ type: Boolean, default: false })
    @IsBoolean()
    isMultiSelectOption: boolean;
}

export const ReportFilterSchema = SchemaFactory.createForClass(ReportFilter);