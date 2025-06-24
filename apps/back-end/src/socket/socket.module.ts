import { Module } from '@nestjs/common';
import { EnvConfigModule } from '../config/config.module';
import { SocketGateway } from './socket.service';
import { SocketJwtMiddleware } from './socket.middleware';
import { AuthenticateUserRequest } from '../helper/jwt.helper';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule, EnvConfigModule],
    controllers: [],
    providers: [SocketGateway, SocketJwtMiddleware, AuthenticateUserRequest],
    exports: [SocketGateway]
})
export class SocketModule { }
