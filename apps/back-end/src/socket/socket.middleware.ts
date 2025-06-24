// socket-jwt.middleware.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthenticateUserRequest } from '../helper/jwt.helper';

@Injectable()
export class SocketJwtMiddleware {
    constructor(private readonly authenticateUserRequest: AuthenticateUserRequest) { }

    async use(socket: Socket, next: (err?: Error) => void) {
        const { success, message, data } = await this.authenticateUserRequest.JWT(socket.handshake.headers.authorization);

        if (!success) {
            return socket.emit("file-progress-update", {message});
        }

        socket.data.user = data;

        next();
    }
}
