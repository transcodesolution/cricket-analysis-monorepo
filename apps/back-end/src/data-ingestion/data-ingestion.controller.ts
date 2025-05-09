import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { DataIngestionService } from './data-ingestion.service';
import { MappingDetailDto, UploadFileAndMappingUpdateDto, UserMappingDetailDto } from './dto/mapping-data-ingestion.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';

@Controller()
// @UseGuards(AuthGuard)
export class DataIngestionController {
  constructor(private readonly dataIngestionService: DataIngestionService) { }

  @Post("/check-mapping-and-update")
  async checkMappingAndUpdate(@Body() mappingDetailDto: MappingDetailDto) {
    return this.dataIngestionService.checkMappingAndUpdate(mappingDetailDto);
  }

  @Get("/database/table-names-and-fields")
  @HttpCode(HttpStatus.OK)
  getAllDBSchemaNameWithFields() {
    return this.dataIngestionService.getAllDBSchemaNameWithFields();
  }

  @Post('/update-mapping-and-save-entries')
  @UseInterceptors(FileFieldsInterceptor([{ name: "sheets" }], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // const ext = path.extname(file.originalname);
        cb(null, file.originalname);
      },
    }),
  }))
  async updateMappingAndSaveInformationToDB(@Body() uploadFileAndMappingUpdateDto: UploadFileAndMappingUpdateDto, @UploadedFiles() file: { sheets?: (Pick<Express.Multer.File, "filename"> & { readStream: ReadStream })[] }, @Res() res: Response) {
    let { sheets } = file;
    if (sheets && sheets.length > 0) {
      sheets = sheets.map((file) => ({
        ...file,
        readStream: createReadStream(join("uploads/", file.filename)),
      })) as (File & { name: string; filename: string; buffer: string; readStream: ReadStream })[];
      const extractedSheetInfo = await this.dataIngestionService.readExcelFiles<ReadStream>(sheets);
      let mappingDetailRaw = uploadFileAndMappingUpdateDto.userMappingDetail as unknown as string;
      if (mappingDetailRaw.startsWith("'") && mappingDetailRaw.endsWith("'")) {
        mappingDetailRaw = mappingDetailRaw.slice(1, -1);
      }
      const userMappingDetailDto: UserMappingDetailDto = JSON.parse(mappingDetailRaw);
      return this.dataIngestionService.updateMappingAndSaveInformationToDB(userMappingDetailDto, extractedSheetInfo, res);
    }
    throw new BadRequestException("No files found");
  }
}
