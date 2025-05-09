import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { compare, genSaltSync, hash } from "bcrypt";
import { JwtPayload, sign } from "jsonwebtoken";

@Injectable()
export class CommonHelperService {
    constructor(private readonly configService: ConfigService) {
        this.JWT_TOKEN_SECRET = this.configService.get("JWT_TOKEN_SECRET");
    }

    private readonly JWT_TOKEN_SECRET;

    async generateHash(password = '') {
        const salt = genSaltSync(10);
        const hashPassword = await hash(password, salt);
        return hashPassword;
    }

    compareHash(password = '', hashPassword = '') {
        return compare(password, hashPassword);
    }

    generateToken = (data: JwtPayload) => {
        const token = sign(data, this.JWT_TOKEN_SECRET);
        return token;
    }
}