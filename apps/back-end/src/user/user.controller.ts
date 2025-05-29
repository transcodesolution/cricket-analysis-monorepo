import { Body, Controller, Delete, Get, Param, Patch, Post, Query, SetMetadata, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, DeleteUserByIdDto, GetUserDto, UpdateUserDto } from "./dto/user.dto";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "../guards/auth.guard";
import { UserPermissionCheckerGuard } from "../guards/user-permission-checker.guard";
import { Permission } from "@cricket-analysis-monorepo/constants";
import { ROUTE_PERMISSION_KEY_NAME } from "../helper/constant.helper";

@Controller("/user-management/users")
@UseGuards(AuthGuard, UserPermissionCheckerGuard)
export class UserController {
    BACKEND_URL = "";

    constructor(private readonly userService: UserService, private readonly configService: ConfigService) {
        this.BACKEND_URL = this.configService.get("BACKEND_URL");
    }


    @Post("/")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.CREATE_USER])
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Patch("/:userId")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.UPDATE_USER])
    updateUser(@Param("userId") userId: string, @Body() updateUserDto: UpdateUserDto) {
        updateUserDto.userId = userId;
        return this.userService.updateUser(updateUserDto);
    }

    @Delete("/")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.DELETE_USER])
    deleteUser(@Body() deleteUserByIdDto: DeleteUserByIdDto) {
        return this.userService.deleteUser(deleteUserByIdDto);
    }

    @Get("/")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.VIEW_USER])
    getUser(@Query() getUserDto: GetUserDto) {
        return this.userService.getUser(getUserDto);
    }

    @Get("/:userId")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.VIEW_USER])
    getUserById(@Param("userId") userId: string) {
        return this.userService.getUserById({ userId });
    }
}