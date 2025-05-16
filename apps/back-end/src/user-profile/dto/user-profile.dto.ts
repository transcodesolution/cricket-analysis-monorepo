import { User } from "../../database/model/user.model";
import { PickType } from "@nestjs/mapped-types";

export class UpdateUserProfileDto extends PickType(User, ["firstName", "lastName", "profileImage"]) {
    userId: string;
}