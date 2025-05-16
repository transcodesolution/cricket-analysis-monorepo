import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { CreateUserRoleDto, GetUserRoleDto, UpdateUserRoleDto } from "./dto/user-role.dto";
import { IUserRole } from "@cricket-analysis-monorepo/interfaces";
import { responseMessage } from "../helper/response-message.helper";
import { UserRole } from "../database/model/user-role.model";
import { UserRoleType } from "@cricket-analysis-monorepo/constants";

@Injectable()
export class UserRoleService {
    constructor(@InjectModel(UserRole.name) private readonly userRoleModel: Model<UserRole>) { }

    async createUserRole(createUserRoleDto: CreateUserRoleDto) {
        const role = new this.userRoleModel(createUserRoleDto);
        role.type = UserRoleType.custom;

        await role.save();

        return { message: responseMessage.addDataSuccess("role"), data: role };
    };

    async getUserRoles(getUserRoleDto: GetUserRoleDto) {
        const match: FilterQuery<IUserRole> = {};

        if (getUserRoleDto.search) {
            const searchRegex = new RegExp(getUserRoleDto.search, "i");
            match.$or = [
                { name: searchRegex },
                { type: searchRegex },
            ]
        }

        const [totalData, roles] = await Promise.all([
            this.userRoleModel.countDocuments(match),
            this.userRoleModel.find(match).sort({ _id: 1 }).skip((getUserRoleDto.page - 1) * getUserRoleDto.limit).limit(getUserRoleDto.limit)
        ]);

        return { message: responseMessage.getDataSuccess("roles"), data: { roles, totalData, state: { page: getUserRoleDto.page, limit: getUserRoleDto.limit, page_limit: Math.ceil(totalData / getUserRoleDto.limit) || 1 } } };
    };

    async getUserRoleById({ userRoleId }) {
        const role = await this.userRoleModel.findOne({ _id: userRoleId });

        if (!role) {
            throw new BadRequestException(responseMessage.getDataNotFound("role"));
        }

        return { message: responseMessage.getDataSuccess("role"), data: role };
    };

    async updateUserRole(updateUserRoleDto: UpdateUserRoleDto) {
        const Query: FilterQuery<IUserRole> = { _id: updateUserRoleDto.userRoleId };

        const roleData = await this.userRoleModel.findOne(Query);

        if (roleData?.type === UserRoleType.adminstrator) {
            throw new BadRequestException(responseMessage.customMessage("You can not update the administrator role"));
        }

        const role = await this.userRoleModel.findOneAndUpdate(Query, { $set: updateUserRoleDto }, { new: true });

        if (!role) {
            throw new BadRequestException(responseMessage.getDataNotFound("role"));
        }

        return { message: responseMessage.updateDataSuccess("role"), data: role };
    };
}