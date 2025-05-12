import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto, CreateReportFilterDto, GetPreDestinedReportDto, GetPreDestinedReportFilterDto } from './dto/report.dto';
import { Permission } from '@cricket-analysis-monorepo/constants';
import { ROUTE_PERMISSION_KEY_NAME } from '../helper/constant.helper';
import { AuthGuard } from '../guards/auth.guard';
import { UserPermissionCheckerGuard } from '../guards/user-permission-checker.guard';

@Controller("/report")
@UseGuards(AuthGuard)
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Get('/:id')
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.VIEW_REPORTS, Permission.VIEW_PRE_DEFINED_REPORTS])
    @UseGuards(UserPermissionCheckerGuard)
    getReportById(@Param("id") id: string, @Query("page", ParseIntPipe) page: number, @Query("limit", ParseIntPipe) limit: number, @Query() queryFilter: GetPreDestinedReportFilterDto) {
        return this.reportService.getReportById(id, queryFilter, { page, limit });
    }

    @Get('/')
    @SetMetadata(ROUTE_PERMISSION_KEY_NAME, [Permission.VIEW_REPORTS, Permission.VIEW_PRE_DEFINED_REPORTS])
    @UseGuards(UserPermissionCheckerGuard)
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
