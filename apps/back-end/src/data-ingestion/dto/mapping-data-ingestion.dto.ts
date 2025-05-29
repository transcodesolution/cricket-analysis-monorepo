import { ArrayMinSize, IsArray, IsDefined, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CachedInput, MappingData } from "../../database/model/mapping.model";
import { Type } from "class-transformer";

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
    files: [Pick<ColumnDto, "fileName"> & { mappingsByUser: MappingData[] }];
}

export class UploadFileAndMappingUpdateDto {
    // @ValidateNested({ each: true })
    // @Type(() => ColumnDto)
    // @IsArray()
    // @IsString()
    userMappingDetail: UserMappingDetailDto;
}

export class InputUpdateDto {
    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => CachedInput)
    inputs: CachedInput;

    @IsNotEmpty()
    @IsString()
    fileName: string;
}

export class UploadFileDto {
    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => InputUpdateDto)
    files: InputUpdateDto[];
}