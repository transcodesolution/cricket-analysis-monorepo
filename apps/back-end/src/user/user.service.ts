import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto, GetUserDto, UpdateLoginUserDto, UpdateUserDto } from "./dto/user.dto";
import { User } from "../database/model/user.model";
import { CommonHelperService } from "../helper/common.helper";
import { responseMessage } from "../helper/response-message.helper";
import { unlinkSync } from "fs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
    BACKEND_URL = "";

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly commonHelperService: CommonHelperService, private readonly configService: ConfigService) {
        this.BACKEND_URL = this.configService.get("BACKEND_URL");
    }


    async createUser(createUserDto: CreateUserDto) {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });

        if (existingUser) {
            throw new BadRequestException(responseMessage.dataAlreadyExist("email"));
        }

        if (createUserDto.password) {
            createUserDto.password = await this.commonHelperService.generateHash(createUserDto.password);
        }

        const newUser = new this.userModel(createUserDto);
        await newUser.save();

        return { message: responseMessage.addDataSuccess("user"), data: { user: newUser } };
    };

    async updateUser(updateUserDto: UpdateUserDto) {
        if (updateUserDto.email) {
            const existingUser = await this.userModel.findOne({ _id: { $ne: updateUserDto.userId }, userName: updateUserDto.email });

            if (existingUser) {
                throw new BadRequestException(responseMessage.dataAlreadyExist("userName"));
            }
        }

        if (updateUserDto.password) {
            updateUserDto.password = await this.commonHelperService.generateHash(updateUserDto.password);
        }

        const user = await this.userModel.findOne({ _id: updateUserDto.userId });

        if (!user) {
            throw new BadRequestException(responseMessage.getDataNotFound("user"));
        }

        Object.assign(user, updateUserDto);

        await user.save();

        return { message: responseMessage.updateDataSuccess("user"), data: { user } };
    };

    async updateLoginUser(updateLoginUserDto: UpdateLoginUserDto) {
        if (updateLoginUserDto.email) {
            const existingUser = await this.userModel.findOne({ _id: { $ne: updateLoginUserDto.userId }, email: updateLoginUserDto.email });

            if (existingUser) {
                throw new BadRequestException(responseMessage.dataAlreadyExist("email"));
            }
        }

        const user = await this.userModel.findOne({ _id: updateLoginUserDto.userId });

        if (!user) {
            throw new BadRequestException(responseMessage.getDataNotFound("user"));
        }

        if (user?.profileImage && updateLoginUserDto.profileImage) {
            try {
                unlinkSync(user.profileImage.replace(this.BACKEND_URL, ""));
            } catch {
                throw new BadRequestException("Error removing existing profile image");
            }
        }

        Object.assign(user, updateLoginUserDto);

        await user.save();

        return { message: responseMessage.updateDataSuccess("user"), data: { user } };
    };

    async getUserById({ userId }: { userId: string }) {
        const user = await this.userModel.findOne({ _id: userId });

        if (!user) {
            throw new BadRequestException(responseMessage.getDataNotFound("user"));
        }

        return { message: responseMessage.addDataSuccess("user details"), data: { user } };
    };

    async getUser(getUserDto: GetUserDto) {
        const [totalData, users] = await Promise.all([
            this.userModel.countDocuments({}),
            this.userModel.find({}).sort({ _id: 1 }).populate("role", "name type").skip((getUserDto.page - 1) * getUserDto.limit).limit(getUserDto.limit)
        ]);

        return { message: responseMessage.addDataSuccess("user"), data: { users, totalData, state: { page: getUserDto.page, limit: getUserDto.limit, page_limit: Math.ceil(totalData / getUserDto.limit) || 1 } } };
    };
}