import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginDto } from "./dto/auth.dto";
import { IUser, IUserRole } from "@cricket-analysis-monorepo/interfaces";
import { User } from "../database/model/user.model";
import { CommonHelperService } from "../helper/common.helper";
import { responseMessage } from "../helper/response-message.helper";

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly commonHelperService: CommonHelperService) { }

    async login(loginDto: LoginDto) {
        const response = await this.userModel.findOne<IUser>({ email: loginDto.email }).populate<{ role: IUserRole }>("role");

        if (!response) throw new BadRequestException(responseMessage.userNotFound);
        if (!response.role) throw new BadRequestException(responseMessage.customMessage("user have not valid permissions"));

        const passwordMatch = await this.commonHelperService.compareHash(loginDto.password, response.password);

        if (!passwordMatch) throw new BadRequestException(responseMessage.invalidUserPasswordEmail);

        if (typeof response.role !== "string") {
            const token = this.commonHelperService.generateToken({
                userId: response._id.toString(),
                type: response.role.type,
                status: "Login",
                generatedOn: (new Date().getTime())
            })
            response._doc.token = token;
        }

        return { message: responseMessage.loginSuccess, data: response };
    }
}