import { Job, Worker } from 'bullmq';
import { QUEUES, TASKS } from '../helper/constant.helper';
import { DataIngestionService } from '../data-ingestion/data-ingestion.service';
import { IFileProgressData, IMatchSheetFormat } from '@cricket-analysis-monorepo/interfaces';
import { SocketGateway } from '../socket/socket.service';
import { RedisService } from '../redis/redis.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { responseMessage } from '../helper/response-message.helper';

interface IFileProcessToDatabase {
    requestUniqueId: string;
    fileName: string;
    fileData: IMatchSheetFormat;
    userId: string;
    totalFiles: number;
    extension: string;
}

@Injectable()
export class FileUploadConsumer implements OnModuleInit {
    private readonly logger = new Logger(QUEUES.fileUpload)
    public worker: Worker;

    constructor(private readonly dataIngestionService: DataIngestionService, private readonly socketGateway: SocketGateway, private readonly redisService: RedisService, private readonly configService: ConfigService) {
    }

    onModuleInit() {
        this.logger.log('Initializing FileUploadConsumer worker...');

        this.worker = new Worker<IFileProcessToDatabase>(
            QUEUES.fileUpload,
            async (job: Job<IFileProcessToDatabase>) => {
                await this.process(job);
            },
            {
                connection: {
                    host: this.configService.get('REDIS_HOST'),
                    port: this.configService.get<number>('REDIS_PORT'),
                },
            },
        );
    }

    sendSocketMessage(userId: string, isFileProcessedSuccessfully: boolean, { totalErroredFiles, totalFilesProcessed, totalAlreadyUploadedFiles, totalFiles, requestUniqueId }: IFileProgressData) {
        const fileProgressData: IFileProgressData = { totalFilesProcessed, totalErroredFiles, totalAlreadyUploadedFiles, totalFiles, requestUniqueId };
        const socketEventName = "file-progress-update";
        if (isFileProcessedSuccessfully) {
            return this.socketGateway.server.to(userId).emit(socketEventName, { success: true, message: responseMessage.customMessage(+totalErroredFiles ? "files processed successfully but some files exit with an error" : "all files are processed successfully"), data: fileProgressData });
        }
        return this.socketGateway.server.to(userId).emit(socketEventName, { success: true, message: responseMessage.customMessage("files are currently in queue and processing sequentially"), data: fileProgressData });
    }

    async process(job: Job<IFileProcessToDatabase>) {
        switch (job.name) {
            case TASKS.processMappingSheetDataWithDatabaseKeys: {
                const { requestUniqueId, fileName, fileData, userId, totalFiles, extension } = job.data;
                this.logger.log(`${job.name} is started! with processing file : ${fileName}`);
                const alreadyUploadCountRedisKey = requestUniqueId + "-" + "alreadyUploadCount";
                const processCountRedisKey = requestUniqueId + "-" + "processedCount";
                const errorCountRedisKey = requestUniqueId + "-" + "errorCount";
                const processingCount = await this.redisService.get(processCountRedisKey);
                const errorCount = await this.redisService.get(errorCountRedisKey);
                let totalFilesProcessed: string = processingCount || "0", totalErroredFiles = errorCount || "0";
                try {
                    const response = await this.dataIngestionService.processMappingSheetDataWithDatabaseKeys(fileName, fileData, alreadyUploadCountRedisKey, extension);
                    if (response.isFileProcessedSuccessfully) {
                        totalFilesProcessed = (+(processingCount || 0) + 1).toString();
                        this.redisService.set(processCountRedisKey, totalFilesProcessed);
                    }
                } catch (error) {
                    this.logger.debug(error, error.stack);
                    const errorCount = await this.redisService.get(errorCountRedisKey);
                    totalErroredFiles = (+(errorCount || 0) + 1).toString();
                    this.redisService.set(errorCountRedisKey, totalErroredFiles);
                }
                let totalAlreadyUploadedFiles = await this.redisService.get(alreadyUploadCountRedisKey);
                totalAlreadyUploadedFiles = totalAlreadyUploadedFiles || "0";
                const resData: IFileProgressData = { requestUniqueId, totalAlreadyUploadedFiles, totalErroredFiles, totalFiles, totalFilesProcessed };
                this.sendSocketMessage(userId, false, resData);
                if (+totalFilesProcessed + +totalErroredFiles + +totalAlreadyUploadedFiles === +totalFiles) {
                    this.sendSocketMessage(userId, false, resData);
                    this.redisService.del(alreadyUploadCountRedisKey);
                    this.redisService.del(processCountRedisKey);
                    this.redisService.del(errorCountRedisKey);
                }
            }
        }
    }
}
