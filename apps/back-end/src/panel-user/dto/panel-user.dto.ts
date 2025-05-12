import { IsOptional, IsString } from "class-validator";
import { User } from "../../database/model/user.model";
import { PickType } from "@nestjs/mapped-types";

export class UpdatePanelUserDto extends PickType(User, ["firstName", "lastName", "profileImage"]) {
    @IsOptional()
    @IsString()
    email: string;

    userId: string;
}