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

const ROUTE_PREFIX = '/mappings';

@Controller()
@UseGuards(AuthGuard, UserPermissionCheckerGuard)
export class DataIngestionController {
  constructor(private readonly dataIngestionService: DataIngestionService) {}

  @Post(`${ROUTE_PREFIX}/validate`)
  @SetMetadata(ROUTE_PERMISSION_KEY_NAME, uploadFilePermissions)
  async validateMapping(@Body() mappingDetailDto: MappingDetailDto) {
    return this.dataIngestionService.checkMappingAndUpdate(mappingDetailDto);
  }

  @Get('/database/schema')
  @HttpCode(HttpStatus.OK)
  @SetMetadata(ROUTE_PERMISSION_KEY_NAME, uploadFilePermissions)
  getDatabaseSchema() {
    return this.dataIngestionService.getAllDBSchemaNameWithFields({ isSoftwareCall: false });
  }

  @Post(`${ROUTE_PREFIX}/update-and-validate-inputs`)
  @HttpCode(HttpStatus.OK)
  @SetMetadata(ROUTE_PERMISSION_KEY_NAME, uploadFilePermissions)
  @UseInterceptors(FileFieldsInterceptor([{ name: "sheets" }], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => cb(null, file.originalname),
    }),
  }))
  async updateMappingAndValidateInputs(
    @Body() dto: UploadFileAndMappingUpdateDto,
    @UploadedFiles() file: { sheets?: IMulterFileObject[] },
  ) {
    const { sheets } = file;
    if (sheets && sheets.length > 0) {
      return this.dataIngestionService.updateMappingAndCheckForUserInputFields(dto, sheets);
    }
    throw new BadRequestException("No files found");
  }

  @Post('/entries/save')
  @HttpCode(HttpStatus.OK)
  @SetMetadata(ROUTE_PERMISSION_KEY_NAME, uploadFilePermissions)
  async saveMappingEntries(
    @Body() uploadFileDto: UploadFileDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.dataIngestionService.updateMappingAndSaveInformationToDB(
      uploadFileDto,
      res,
      req.id,
      req.headers.user._id,
    );
  }
}