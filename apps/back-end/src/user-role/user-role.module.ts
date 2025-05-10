import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';
import { AuthenticateUserRequest } from '../helper/jwt.helper';
import { EnvConfigModule } from '../config/config.module';

@Module({
    imports: [DatabaseModule, EnvConfigModule],
    controllers: [UserRoleController],
    providers: [UserRoleService, AuthenticateUserRequest],
})
export class UserRoleModule { }
