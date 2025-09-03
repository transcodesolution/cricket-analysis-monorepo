import { ArrayMinSize, IsArray, IsDefined, IsString, ValidateNested } from "class-validator";
import { CachedInput, MappingData } from "../../database/model/mapping.model";
import { Type } from "class-transformer";
import { PickType } from "@nestjs/mapped-types";

export class ColumnDto {
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    columns: string[];

    @IsDefined()
    @IsString()
    fileName: string;

    constructor() {
        this.columns = [];
        this.fileName = '';
    }
}

export class MappingDetailDto {
    files: ColumnDto[];
}

export class UserMappingDetailDto {
    fileNames: string[];
    mappingsByUser: MappingData[]
}

export class UploadFileAndMappingUpdateDto {
    userMappingDetail: UserMappingDetailDto;
}

class CachedInputDto {
    [keyname: string]: string;
}

export class InputUpdateDto extends PickType(CachedInput, ["collectionName", "referenceKey", "referenceValue"]) {
    @ValidateNested()
    @Type(() => CachedInputDto)
    inputs: CachedInputDto;
}

export class UploadFileDto {
    userInputs: InputUpdateDto[];
    fileNames: string[];
}