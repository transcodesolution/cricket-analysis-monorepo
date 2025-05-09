import { ArrayMinSize, IsArray, IsDefined, IsString } from "class-validator";
import { MappingData } from "../../database/model/mapping.model";

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
    constructor() {
        this.files = [];
    }
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

    constructor() {
        this.userMappingDetail = { files: [{ mappingsByUser: [], fileName: "" }] };
    }
}