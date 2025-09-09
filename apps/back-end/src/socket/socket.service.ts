import { Logger } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { ConfigService } from "@nestjs/config";
import { SocketJwtMiddleware } from "./socket.middleware";
import { NextFunction } from "express";
import { IFileProgressData } from "@cricket-analysis-monorepo/interfaces";
import { responseMessage } from "../helper/response-message.helper";

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
        socket.join(socket.data.user._id.toString());
        this.logger.log(`Socket connected: ${socket.id}`);
    }

    handleDisconnect(socket: Socket) {
        this.logger.log(`Socket disconnected: ${socket.id}`);
    }

    sendSocketMessage(userId: string, isFileProcessedSuccessfully: boolean, { totalErroredFiles, totalFilesProcessed, totalAlreadyUploadedFiles, totalFiles, requestUniqueId }: IFileProgressData) {
        const fileProgressData: IFileProgressData = { totalFilesProcessed, totalErroredFiles, totalAlreadyUploadedFiles, totalFiles, requestUniqueId };
        const socketEventName = "file-progress-update";
        if (isFileProcessedSuccessfully) {
            return this.server.to(userId).emit(socketEventName, { success: true, message: responseMessage.customMessage(+totalErroredFiles ? "files processed successfully but some files exit with an error" : "all files are processed successfully"), data: fileProgressData });
        }
        return this.server.to(userId).emit(socketEventName, { success: false, message: responseMessage.customMessage("files are currently in queue and processing sequentially"), data: fileProgressData });
    }
}