import { Body, Controller, Get, Patch, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { extname } from "path";
import { AuthGuard } from "../guards/auth.guard";
import { UserProfileService } from "./user-profile.service";
import { UpdateUserProfileDto } from "./dto/user-profile.dto";

@Controller("/user/profile")
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
export class UserProfileController {
    BACKEND_URL = "";

    constructor(private readonly userService: UserProfileService, private readonly configService: ConfigService) {
        this.BACKEND_URL = this.configService.get("BACKEND_URL");
    }

    @Patch("/")
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
    updateUser(@Req() req: Request, @Body() updatePanelUserDto: UpdateUserProfileDto, @UploadedFile() file: Express.Multer.File) {
        if (file?.filename) {
            updatePanelUserDto.profileImage = this.BACKEND_URL + "uploads/" + file.filename;
        }
        updatePanelUserDto.userId = req.headers.user._id;
        return this.userService.updateUser(updatePanelUserDto);
    }

    @Get("/")
    getUserProfile(@Req() req: Request) {
        return this.userService.getUserProfile({ userId: req.headers.user._id });
    }
}