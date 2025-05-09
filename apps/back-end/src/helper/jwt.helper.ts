import { verify } from 'jsonwebtoken'
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { responseMessage } from './response-message.helper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRoleType } from '@cricket-analysis-monorepo/constants';
import { User } from '../database/model/user.model';

declare module "jsonwebtoken" {
    interface JwtPayload {
        userId: string;
        type: UserRoleType;
        status: string;
        generatedOn: number;
    }
}

@Injectable()
export class AuthenticateUserRequest {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly configService: ConfigService) {
        this.jwtTokenSecret = this.configService.get("JWT_TOKEN_SECRET");
    }

    private readonly jwtTokenSecret = "";

    async JWT(authorization: string) {
        if (authorization) {
            try {
                authorization = authorization.replace("Bearer ", "");
                const isVerifyToken = verify(authorization, this.jwtTokenSecret);
                const checkToken = typeof isVerifyToken !== "string";
                // if (process?.env?.NODE_ENV == 'production' && checkToken) {
                // 1 day expiration
                // if (parseInt(isVerifyToken.generatedOn + 86400000) < new Date().getTime()) {
                // if (parseInt(isVerifyToken.generatedOn + 120000) < new Date().getTime()) {
                //     return { success: false, message: responseMessage.tokenExpire };
                // }
                // }    

                if (checkToken) {
                    const Query = { _id: isVerifyToken?.userId };

                    const result = await this.userModel.findOne(Query).populate("role").lean();

                    if (result) {
                        return { success: true, data: result };
                    } else {
                        return { success: false, message: responseMessage.invalidToken };
                    }
                }

            } catch (err) {
                if (err.message == "invalid signature") return { success: false, message: responseMessage.differentToken };
                return { success: false, message: responseMessage.invalidToken };
            }
        } else {
            return { success: false, message: responseMessage.invalidToken };
        }
    }
}



