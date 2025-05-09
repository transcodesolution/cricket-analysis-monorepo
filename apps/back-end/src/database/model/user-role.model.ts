import { Permission, UserRoleType } from '@cricket-analysis-monorepo/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class UserRole {
    @Prop({ type: String })
    name: string;

    @Prop({ type: String, enum: UserRoleType })
    type: UserRoleType;

    @Prop({ type: [String], enum: Permission })
    permissions: Permission[];

    constructor() {
        this.name = "";
        this.type = UserRoleType.adminstrator;
        this.permissions = [];
    }
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);