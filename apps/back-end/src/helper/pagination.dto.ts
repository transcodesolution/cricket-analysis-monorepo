import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @Transform((obj) => (+obj.value))
    page: number;

    @IsOptional()
    @Transform((obj) => (+obj.value))
    limit: number;

    @IsOptional()
    @IsString()
    search?: string;

    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}