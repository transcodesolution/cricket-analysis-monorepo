import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginDto } from "./dto/auth.dto";
import { IUser, IUserRole } from "@cricket-analysis-monorepo/interfaces";
import { User } from "../database/model/user.model";
import { CommonHelperService } from "../helper/common.helper";
import { responseMessage } from "../helper/response-message.helper";

interface ILoginResponse extends Pick<IUser, "firstName" | "lastName" | "_id" | "email"> {
    token: string;
    userType: string;
}

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly commonHelperService: CommonHelperService) { }

    async login(loginDto: LoginDto) {
        const response = await this.userModel.findOne({ email: loginDto.email }).populate<{ role: IUserRole }>("role")

        if (!response) throw new BadRequestException(responseMessage.userNotFound);
        if (!response.role) throw new BadRequestException(responseMessage.customMessage("user have not valid permissions"));

        const passwordMatch = await this.commonHelperService.compareHash(loginDto.password, response.password);

        if (!passwordMatch) throw new BadRequestException(responseMessage.invalidUserPasswordEmail);

        let result: ILoginResponse;
        if (typeof response.role !== "string") {
            const token = this.commonHelperService.generateToken({
                userId: response._id.toString(),
                type: response.role.type,
                status: "Login",
                generatedOn: (new Date().getTime())
            })
            result = {
                userType: response.role.type,
                firstName: response?.firstName,
                lastName: response?.lastName,
                _id: response?._id.toString(),
                email: response?.email,
                token,
            }
        }

        return { message: responseMessage.loginSuccess, data: result };
    }
}