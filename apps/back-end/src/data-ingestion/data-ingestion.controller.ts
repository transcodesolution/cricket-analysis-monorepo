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
  SetMetadata,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { DataIngestionService } from './data-ingestion.service';
import { MappingDetailDto, UploadFileAndMappingUpdateDto, UploadFileDto } from './dto/mapping-data-ingestion.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Permission } from '@cricket-analysis-monorepo/constants';
import { ROUTE_PERMISSION_KEY_NAME } from '../helper/constant.helper';
import { AuthGuard } from '../guards/auth.guard';
import { UserPermissionCheckerGuard } from '../guards/user-permission-checker.guard';
import { IMulterFileObject } from './dto/interfaces';
import { Request, Response } from 'express';

const uploadFilePermissions = [Permission.UPLOAD_FILES];

@Controller()
@UseGuards(AuthGuard, UserPermissionCheckerGuard)
export class DataIngestionController {
  constructor(private readonly dataIngestionService: DataIngestionService) { }

  @Post("/check-mapping-and-update")
  @SetMetadata(ROUTE_PERMISSION_KEY_NAME, uploadFilePermissions)
  async checkMappingAndUpdate(@Body() mappingDetailDto: MappingDetailDto) {
    return this.dataIngestionService.checkMappingAndUpdate(mappingDetailDto);
  }

  @Get("/database/table-names-and-fields")
  @HttpCode(HttpStatus.OK)
  @SetMetadata(ROUTE_PERMISSION_KEY_NAME, uploadFilePermissions)
  getAllDBSchemaNameWithFields() {
    return this.dataIngestionService.getAllDBSchemaNameWithFields({ isSoftwareCall: false });
  }

  @Post('/update-mapping-and-check-required-inputs')
  @HttpCode(HttpStatus.OK)
  @SetMetadata(ROUTE_PERMISSION_KEY_NAME, uploadFilePermissions)
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
  async updateMappingAndCheckForUserInputFields(@Body() uploadFileAndMappingUpdateDto: UploadFileAndMappingUpdateDto, @UploadedFiles() file: { sheets?: IMulterFileObject[] }) {
    const { sheets } = file;
    if (sheets && sheets.length > 0) {
      return this.dataIngestionService.updateMappingAndCheckForUserInputFields(uploadFileAndMappingUpdateDto, sheets);
    }
    throw new BadRequestException("No files found");
  }

  @Post('/update-input-and-save-entries')
  @HttpCode(HttpStatus.OK)
  @SetMetadata(ROUTE_PERMISSION_KEY_NAME, uploadFilePermissions)
  async updateMappingAndSaveInformationToDB(@Body() uploadFileDto: UploadFileDto, @Req() req: Request, @Res() res: Response) {
    return this.dataIngestionService.updateMappingAndSaveInformationToDB(uploadFileDto, res, req.id, req.headers.user._id);
  }
}
