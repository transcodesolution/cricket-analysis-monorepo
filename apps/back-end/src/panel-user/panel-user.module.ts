import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PanelUserController } from './panel-user.controller';
import { CommonHelperService } from '../helper/common.helper';
import { EnvConfigModule } from '../config/config.module';
import { AuthenticateUserRequest } from '../helper/jwt.helper';
import { PanelUserService } from './panel-user.service';

@Module({
    imports: [DatabaseModule, EnvConfigModule],
    controllers: [PanelUserController],
    providers: [PanelUserService, CommonHelperService, AuthenticateUserRequest],
})
export class PanelUserModule { }
