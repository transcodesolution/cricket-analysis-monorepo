
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES, TASKS } from '../helper/constant.helper';
import { DataIngestionService } from '../data-ingestion/data-ingestion.service';
import { IMatchSheetFormat } from '@cricket-analysis-monorepo/interfaces';
import { SocketGateway } from '../socket/socket.service';
import { RedisService } from '../redis/redis.service';

interface IFileProcessToDatabase {
    requestUniqueId: string;
    fileName: string;
    fileData: IMatchSheetFormat;
    userId: string;
    totalFiles: number;
}

@Processor(QUEUES.fileUpload)
export class FileUploadConsumer extends WorkerHost {
    constructor(private readonly dataIngestionService: DataIngestionService, private readonly socketGateway: SocketGateway, private readonly redisService: RedisService) {
        super();
    }

    async process(job: Job<IFileProcessToDatabase>) {
        switch (job.name) {
            case TASKS.processMappingSheetDataWithDatabaseKeys: {
                const { requestUniqueId, fileName, fileData, userId, totalFiles } = job.data;
                let totalFilesProcessed: string, totalErroredFiles = "0";
                try {
                    await this.dataIngestionService.processMappingSheetDataWithDatabaseKeys(fileName, fileData);
                    const processCountRedisKey = requestUniqueId + "-" + "processedCount";
                    const processingCount = await this.redisService.get(processCountRedisKey);
                    totalFilesProcessed = (+(processingCount || 0) + 1).toString();
                    this.redisService.set(processCountRedisKey, totalFilesProcessed);
                } catch (error) {
                    const errorCountRedisKey = requestUniqueId + "-" + "errorCount";
                    const errorCount = await this.redisService.get(errorCountRedisKey);
                    totalErroredFiles = (+(errorCount || 0) + 1).toString();
                    this.redisService.set(errorCountRedisKey, totalErroredFiles);
                }
                this.socketGateway.server.to(userId.toString()).emit("file-progress-update", { totalFilesProcessed, totalErroredFiles, totalFiles, requestUniqueId });
            }
        }
    }
}
