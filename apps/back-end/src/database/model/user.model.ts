import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { UserRole } from './user-role.model';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

@Schema({
    timestamps: true, versionKey: false, toJSON: {
        virtuals: true
    }, virtuals: {
        role: {
            options: {
                ref: UserRole.name,
                localField: 'roleId',
                foreignField: '_id',
                justOne: true
            }
        },
    }
})
export class User {
    @Prop({ type: String })
    @IsOptional()
    @IsString()
    firstName: string;

    @Prop({ type: String })
    @IsOptional()
    @IsString()
    lastName: string;

    @Prop({ default: '' })
    @IsNotEmpty()
    @IsString()
    email: string;

    @Prop({
        type: String,
    })
    @IsNotEmpty()
    @MinLength(8)
    @IsString()
    password: string;

    @Prop({ type: SchemaTypes.ObjectId })
    @IsNotEmpty()
    @IsString()
    roleId: string;

    @Prop({ type: String })
    @IsOptional()
    @IsString()
    profileImage: string;

    role?: UserRole;

    constructor() {
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.password = "";
        this.roleId = "";
        this.profileImage = "";
    }
}

export const UserSchema = SchemaFactory.createForClass(User);