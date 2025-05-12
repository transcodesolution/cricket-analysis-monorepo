import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CommonHelperService } from '../helper/common.helper';
import { EnvConfigModule } from '../config/config.module';
import { AuthenticateUserRequest } from '../helper/jwt.helper';

@Module({
    imports: [DatabaseModule, EnvConfigModule],
    controllers: [UserController],
    providers: [UserService, CommonHelperService, AuthenticateUserRequest],
})
export class UserModule { }
