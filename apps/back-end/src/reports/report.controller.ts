import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto, CreateReportFilterDto, GetPreDestinedReportDto, GetPreDestinedReportFilterDto } from './dto/report.dto';

@Controller("/report")
// @UseGuards(AuthGuard)
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Get('/:id')
    getReportById(@Param("id") id: string, @Query("page", ParseIntPipe) page: number, @Query("limit", ParseIntPipe) limit: number, @Query() queryFilter: GetPreDestinedReportFilterDto) {
        return this.reportService.getReportById(id, queryFilter, { page, limit });
    }

    @Get('/')
    getReports(@Query() getPreDestinedReportDto: GetPreDestinedReportDto) {
        return this.reportService.getReports(getPreDestinedReportDto);
    }

    @Post("/create")
    createReport(@Body() createReportDto: CreateReportDto) {
        return this.reportService.createReport(createReportDto);
    }

    @Post("/filter/create")
    createReportFilters(@Body() createReportFilterDto: CreateReportFilterDto) {
        return this.reportService.createReportFilter(createReportFilterDto);
    }
}
