import { IsOptional, IsString, MinLength } from "class-validator";
import { User } from "../../database/model/user.model";
import { PickType } from "@nestjs/mapped-types";
import { PaginationDto } from "../../helper/pagination.dto";

export class CreateUserDto extends PickType(User, ["email", "password", "roleId"]) { }

export class UpdateUserDto extends CreateUserDto {
    @IsOptional()
    @MinLength(8)
    @IsString()
    password: string;

    userId: string;

    @IsOptional()
    @IsString()
    email: string;
}

export class UpdateLoginUserDto extends PickType(User, ["firstName", "lastName", "profileImage"]) {
    @IsOptional()
    @IsString()
    email: string;

    userId: string;
}

export class GetUserDto extends PaginationDto { }

export class GetUserByIdDto extends PickType(UpdateUserDto, ["userId"]) { }