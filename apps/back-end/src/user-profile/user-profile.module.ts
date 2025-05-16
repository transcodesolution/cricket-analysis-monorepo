import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserProfileController } from './user-profile.controller';
import { CommonHelperService } from '../helper/common.helper';
import { EnvConfigModule } from '../config/config.module';
import { AuthenticateUserRequest } from '../helper/jwt.helper';
import { UserProfileService } from './user-profile.service';

@Module({
    imports: [DatabaseModule, EnvConfigModule],
    controllers: [UserProfileController],
    providers: [UserProfileService, CommonHelperService, AuthenticateUserRequest],
})
export class UserProfileModule { }
