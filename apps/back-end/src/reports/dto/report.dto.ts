import { ArrayMinSize, IsMongoId, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FilterConfiguration } from "../../database/model/report.model";
import { ReportFilter } from "../../database/model/report-filters.model";
import { PaginationDto } from "../../helper/pagination.dto";

class ReportDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    collectionName: string;

    @IsNotEmpty()
    @IsString()
    query: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => FilterConfiguration)
    filters: FilterConfiguration[];

    constructor() {
        this.name = "";
        this.collectionName = "";
        this.query = "";
        this.filters = [];
    }
}

class ReportFilterDto extends ReportFilter { }

export class GetPreDestinedReportByIdDto {
    @IsNotEmpty()
    @IsMongoId()
    id: string;

    constructor() {
        this.id = "";
    }
}

export class GetPreDestinedReportFilterDto {
    [key: string]: string | string[];
}

export class GetPreDestinedReportDto extends PaginationDto {
    constructor() {
        super();
    }
}

export class CreateReportDto {
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ReportDto)
    reports: ReportDto[];

    constructor() {
        this.reports = [];
    }
}

export class CreateReportFilterDto {
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ReportFilterDto)
    reportFilters: ReportFilterDto[];

    constructor() {
        this.reportFilters = [];
    }
}