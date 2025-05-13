import { Body, Controller, Get, Patch, Req, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { extname } from "path";
import { AuthGuard } from "../guards/auth.guard";
import { UserPermissionCheckerGuard } from "../guards/user-permission-checker.guard";
import { Permission } from "@cricket-analysis-monorepo/constants";
import { ROUTE_PERMISSION_KEY_NAME } from "../helper/constant.helper";
import { PanelUserService } from "./panel-user.service";
import { UpdatePanelUserDto } from "./dto/panel-user.dto";

@Controller("/panel-user")
@UseGuards(AuthGuard, UserPermissionCheckerGuard)
export class PanelUserController {
    BACKEND_URL = "";

    constructor(private readonly userService: PanelUserService, private readonly configService: ConfigService) {
        this.BACKEND_URL = this.configService.get("BACKEND_URL");
    }

    @Patch("/")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.UPDATE_PANEL_USER])
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
    updateUser(@Req() req: Request, @Body() updatePanelUserDto: UpdatePanelUserDto, @UploadedFile() file: Express.Multer.File) {
        if (file?.filename) {
            updatePanelUserDto.profileImage = this.BACKEND_URL + "uploads/" + file.filename;
        }
        updatePanelUserDto.userId = req.headers.user._id;
        return this.userService.updateUser(updatePanelUserDto);
    }

    @Get("/")
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.VIEW_PANEL_USER])
    getPanelUserDetails(@Req() req: Request) {
        return this.userService.getPanelUserDetails({ userId: req.headers.user._id });
    }
}