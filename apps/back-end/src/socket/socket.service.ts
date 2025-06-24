import { Logger } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { ConfigService } from "@nestjs/config";
import { SocketJwtMiddleware } from "./socket.middleware";
import { NextFunction } from "express";

@WebSocketGateway({
    namespace: 'event',
    cors: {
        origin: new ConfigService().get<string>('CORS_ORIGIN') || "*"
    }
})
export class SocketGateway {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('SocketGateway');

    constructor(private readonly socketJwtMiddleware: SocketJwtMiddleware) { }

    afterInit() {
        this.server.use((socket: Socket, next: NextFunction) => {
            this.socketJwtMiddleware.use(socket, next);
        });

        this.logger.log('Initialized');
    }

    handleConnection(socket: Socket) {
        console.log(socket.data.user)
        socket.join(socket.data.user._id.toString());
        this.logger.log(`Socket connected: ${socket.id}`);
    }

    handleDisconnect(socket: Socket) {
        this.logger.log(`Socket disconnected: ${socket.id}`);
    }
}