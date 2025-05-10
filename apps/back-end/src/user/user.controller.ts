import { Body, Controller, Get, Param, Patch, Post, Query, Req, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, GetUserDto, UpdateLoginUserDto, UpdateUserDto } from "./dto/user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { extname } from "path";
import { AuthGuard } from "../guards/auth.guard";
import { UserPermissionCheckerGuard } from "../guards/user-permission-checker.guard";
import { Permission } from "@cricket-analysis-monorepo/constants";
import { ROUTE_PERMISSION_KEY_NAME } from "../helper/constant.helper";

@Controller("/user")
@UseGuards(AuthGuard, UserPermissionCheckerGuard)
export class UserController {
    BACKEND_URL = "";

    constructor(private readonly userService: UserService, private readonly configService: ConfigService) {
        this.BACKEND_URL = this.configService.get("BACKEND_URL");
    }


    @Post("/create")
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

    @Patch("/")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.UPDATE_USER])
    @UseInterceptors(FileInterceptor("profileImage", {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                cb(null, `${uniqueSuffix}${ext}`);
            },
        }),
    }))
    updateLoginUser(@Req() req: Request, @Body() updateLoginUserDto: UpdateLoginUserDto, @UploadedFile() file: Express.Multer.File) {
        if (file?.filename) {
            updateLoginUserDto.profileImage = this.BACKEND_URL + "uploads/" + file.filename;
        }
        updateLoginUserDto.userId = req.headers.user._id;
        return this.userService.updateLoginUser(updateLoginUserDto);
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