import { UserRole } from "../../database/model/user-role.model";
import { PaginationDto } from "../../helper/pagination.dto";
import { PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserRoleDto extends PickType(UserRole, ["name", "permissions"]) {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class UpdateUserRoleDto extends CreateUserRoleDto {
    @IsOptional()
    @IsString()
    name: string;
    userRoleId: string;
}

export class GetUserRoleDto extends PaginationDto { }

export class GetUserRoleByIdDto extends PickType(UpdateUserRoleDto, ["userRoleId"]) { }