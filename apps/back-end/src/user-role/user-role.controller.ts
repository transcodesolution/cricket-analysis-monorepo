import { Body, Controller, Delete, Get, Param, Patch, Post, Query, SetMetadata, UseGuards } from "@nestjs/common";
import { UserRoleService } from "./user-role.service";
import { CreateUserRoleDto, DeleteUserRoleByIdDto, GetUserRoleDto, UpdateUserRoleDto } from "./dto/user-role.dto";
import { Permission } from "@cricket-analysis-monorepo/constants";
import { ROUTE_PERMISSION_KEY_NAME } from "../helper/constant.helper";
import { AuthGuard } from "../guards/auth.guard";
import { UserPermissionCheckerGuard } from "../guards/user-permission-checker.guard";

@Controller("/user-role")
@UseGuards(AuthGuard, UserPermissionCheckerGuard)
export class UserRoleController {
    constructor(private readonly userRoleService: UserRoleService) { }

    @Post("/create")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.CREATE_ROLE])
    createUserRole(@Body() createUserRoleDto: CreateUserRoleDto) {
        return this.userRoleService.createUserRole(createUserRoleDto);
    }

    @Patch("/:userRoleId")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.UPDATE_ROLE])
    updateUserRole(@Param("userRoleId") userRoleId: string, @Body() updateUserRoleDto: UpdateUserRoleDto) {
        updateUserRoleDto.userRoleId = userRoleId;
        return this.userRoleService.updateUserRole(updateUserRoleDto);
    }

    @Delete("/")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.DELETE_ROLE])
    deleteUserRole(@Body() deleteUserRoleByIdDto: DeleteUserRoleByIdDto) {
        return this.userRoleService.deleteUserRole(deleteUserRoleByIdDto);
    }

    @Get("/")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.VIEW_ROLE])
    getUserRoles(@Query() getUserRoleDto: GetUserRoleDto) {
        return this.userRoleService.getUserRoles(getUserRoleDto);
    }

    @Get("/:userRoleId")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.VIEW_ROLE])
    getUserRoleById(@Param("userRoleId") userRoleId: string) {
        return this.userRoleService.getUserRoleById({ userRoleId });
    }
}