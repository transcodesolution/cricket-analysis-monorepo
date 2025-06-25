
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
                const alreadyUploadCountRedisKey = requestUniqueId + "-" + "alreadyUploadCount";
                const processCountRedisKey = requestUniqueId + "-" + "processedCount";
                const errorCountRedisKey = requestUniqueId + "-" + "errorCount";
                const processingCount = await this.redisService.get(processCountRedisKey);
                let totalFilesProcessed: string=processingCount, totalErroredFiles = "0";
                try {
                    await this.dataIngestionService.processMappingSheetDataWithDatabaseKeys(fileName, fileData);
                    totalFilesProcessed = (+(processingCount || 0) + 1).toString();
                    this.redisService.set(processCountRedisKey, totalFilesProcessed);
                } catch (error) {
                    const errorCount = await this.redisService.get(errorCountRedisKey);
                    totalErroredFiles = (+(errorCount || 0) + 1).toString();
                    this.redisService.set(errorCountRedisKey, totalErroredFiles);
                }
                let totalAlreadyUploadedFiles = await this.redisService.get(alreadyUploadCountRedisKey);
                totalAlreadyUploadedFiles = totalAlreadyUploadedFiles || "0";
                this.socketGateway.server.to(userId.toString()).emit("file-progress-update", { totalFilesProcessed, totalErroredFiles, totalAlreadyUploadedFiles, totalFiles, requestUniqueId });
                if (+totalFilesProcessed + +totalErroredFiles + +totalAlreadyUploadedFiles === +totalFiles) {
                    this.redisService.del(alreadyUploadCountRedisKey);
                    this.redisService.del(processCountRedisKey);
                    this.redisService.del(errorCountRedisKey);
                }
            }
        }
    }
}
