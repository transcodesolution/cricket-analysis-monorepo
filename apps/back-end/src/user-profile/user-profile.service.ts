import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UpdateUserProfileDto } from "./dto/user-profile.dto";
import { User } from "../database/model/user.model";
import { CommonHelperService } from "../helper/common.helper";
import { responseMessage } from "../helper/response-message.helper";
import { unlinkSync } from "fs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserProfileService {
    BACKEND_URL = "";

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly commonHelperService: CommonHelperService, private readonly configService: ConfigService) {
        this.BACKEND_URL = this.configService.get("BACKEND_URL");
    }

    async updateUser(updatePanelUserDto: UpdateUserProfileDto) {
        const user = await this.userModel.findOne({ _id: updatePanelUserDto.userId });

        if (!user) {
            throw new BadRequestException(responseMessage.getDataNotFound("user"));
        }

        if (user?.profileImage && updatePanelUserDto.profileImage) {
            try {
                unlinkSync(user.profileImage.replace(this.BACKEND_URL, ""));
            } catch {
                throw new BadRequestException("Error removing existing profile image");
            }
        }

        Object.assign(user, updatePanelUserDto);

        await user.save();

        return { message: responseMessage.updateDataSuccess("user"), data: { user } };
    };

    getUserProfile(userIdDto: { userId: string }) {
        return this.commonHelperService.getUserById(userIdDto);
    }
}