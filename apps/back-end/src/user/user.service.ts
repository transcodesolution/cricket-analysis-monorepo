import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { CreateUserDto, GetUserDto, UpdateUserDto } from "./dto/user.dto";
import { User } from "../database/model/user.model";
import { CommonHelperService } from "../helper/common.helper";
import { responseMessage } from "../helper/response-message.helper";
import { ConfigService } from "@nestjs/config";
import { UserRoleType } from "@cricket-analysis-monorepo/constants";
import { IUser } from "@cricket-analysis-monorepo/interfaces";
import { UserRole } from "../database/model/user-role.model";

@Injectable()
export class UserService {
    BACKEND_URL = "";

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, @InjectModel(UserRole.name) private readonly userRoleModel: Model<UserRole>, private readonly commonHelperService: CommonHelperService, private readonly configService: ConfigService) {
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

        const user = await this.userModel.findOne({ _id: updateUserDto.userId }).populate("role", "type");

        if (!user) {
            throw new BadRequestException(responseMessage.getDataNotFound("user"));
        }

        if (user.role.type === UserRoleType.adminstrator) {
            throw new BadRequestException(responseMessage.customMessage("Cannot update software defined roles"));
        }

        Object.assign(user, updateUserDto);

        await user.save();

        return { message: responseMessage.updateDataSuccess("user"), data: { user } };
    };

    getUserById(userIdDto: { userId: string }) {
        return this.commonHelperService.getUserById(userIdDto);
    }

    async getUser(getUserDto: GetUserDto) {
        const match: FilterQuery<IUser> = {};

        if (getUserDto.search) {
            const searchRegex = new RegExp(getUserDto.search, "i");
            match.$or = [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { type: searchRegex },
            ]
        }

        const [administratorRoleId] = await this.userRoleModel.distinct("_id", { type: UserRoleType.adminstrator }).lean();

        match.roleId = { $ne: administratorRoleId };

        const [totalData, users] = await Promise.all([
            this.userModel.countDocuments(match),
            this.userModel.find(match).sort({ _id: 1 }).populate("role", "name type").skip((getUserDto.page - 1) * getUserDto.limit).limit(getUserDto.limit)
        ]);

        return { message: responseMessage.getDataSuccess("user"), data: { users, totalData, state: { page: getUserDto.page, limit: getUserDto.limit, page_limit: Math.ceil(totalData / getUserDto.limit) || 1 } } };
    };
}