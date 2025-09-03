import { ArrayMinSize, IsArray, IsBoolean, IsDefined, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CachedInput, MappingData } from "../../database/model/mapping.model";
import { Type } from "class-transformer";
import { PickType } from "@nestjs/mapped-types";
import { EntityType } from "@cricket-analysis-monorepo/constants";

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

    @IsBoolean()
    isUserTypedValue: boolean;

    @IsBoolean()
    typedValue: boolean;

    @IsEnum(EntityType)
    entityType: EntityType;
}

export class UploadFileDto {
    userInputs: InputUpdateDto[];
    fileNames: string[];
}

export class VerifyEntityNameDto {
    @IsNotEmpty()
    @IsEnum(EntityType)
    entityType: EntityType;

    @IsNotEmpty()
    @IsString()
    name: string;
}