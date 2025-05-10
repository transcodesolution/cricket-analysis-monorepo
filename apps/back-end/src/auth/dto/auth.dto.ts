import { PickType } from "@nestjs/mapped-types";
import { User } from "../../database/model/user.model";

export class LoginDto extends PickType(User, ["email", "password"]) { }