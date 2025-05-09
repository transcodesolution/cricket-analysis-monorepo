import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EnvConfigModule } from '../config/config.module';
import { CommonHelperService } from '../helper/common.helper';

@Module({
    imports: [DatabaseModule, EnvConfigModule],
    controllers: [AuthController],
    providers: [AuthService, CommonHelperService],
})
export class AuthModule { }
