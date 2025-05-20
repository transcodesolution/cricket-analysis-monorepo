import { Permission, UserRoleType } from '@cricket-analysis-monorepo/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsOptional } from 'class-validator';
import { ISoftDeleteMethod, softDeletePlugin } from '.';

export interface UserRoleDocument extends UserRole, Document, ISoftDeleteMethod<UserRoleDocument> { }

@Schema({ timestamps: true, versionKey: false })
export class UserRole {
    @Prop({ type: Date, default: null })
    deletedAt: Date;

    @Prop({ type: String })
    name: string;

    @Prop({ type: String, enum: UserRoleType })
    type: UserRoleType;

    @Prop({ type: [String], enum: Permission })
    @IsOptional()
    @IsEnum(Permission, { each: true })
    permissions: Permission[];
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);

UserRoleSchema.plugin(softDeletePlugin<UserRole>);