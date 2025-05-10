import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Player } from '../database/model/player.model';
import { Tournament } from '../database/model/tournament.model';
import { MatchFormat } from '@cricket-analysis-monorepo/constants';
import { responseMessage } from '../helper/response-message.helper';
import { CreateReportDto, CreateReportFilterDto, GetPreDestinedReportDto, GetPreDestinedReportFilterDto } from './dto/report.dto';
import { Report } from '../database/model/report.model';
import { ReportFilter } from '../database/model/report-filters.model';
import { Team } from '../database/model/team.model';
import { IReport, IReportFilter } from '@cricket-analysis-monorepo/interfaces';
import { PaginationDto } from '../helper/pagination.dto';

interface IFilterExecutionParameter {
  schema: string;
  filters: { matchFormat?: MatchFormat }
}

@Injectable()
export class ReportService {
  private readonly collections = {
    player: this.playerModel,
    tournament: this.tournamentModel,
    team: this.teamModel,
  }

  private readonly getFunctionNameRegex = /function\s+([a-zA-Z0-9_$]+)\s*\(/;

  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    @InjectModel(Tournament.name) private readonly tournamentModel: Model<Tournament>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @InjectModel(ReportFilter.name) private readonly reportFilterModel: Model<ReportFilter>,
  ) { }

  async createReport(createReportDto: CreateReportDto) {
    const reportFilterIds = createReportDto.reports.flatMap((i) => i.filters.map((j) => j.id));

    const checkReportFilterExist = await this.reportFilterModel.find({ _id: { $in: reportFilterIds } });

    if (checkReportFilterExist.length !== reportFilterIds.length) {
      throw new BadRequestException(responseMessage.getDataNotFound("report filters"));
    }

    const report = await this.reportModel.insertMany(createReportDto.reports);
    return { data: report, message: responseMessage.addDataSuccess("reports") };
  }

  async createReportFilter(createReportFilterDto: CreateReportFilterDto) {
    const reportFilters = await this.reportFilterModel.insertMany(createReportFilterDto.reportFilters);
    return { data: reportFilters, message: responseMessage.addDataSuccess("report filters") };
  }

  async getReports(getPreDestinedReportDto: GetPreDestinedReportDto) {
    const [totalData, reports] = await Promise.all([
      this.reportModel.countDocuments(),
      this.reportModel.find({}, { name: 1 }).skip((getPreDestinedReportDto.page - 1) * getPreDestinedReportDto.limit).limit(getPreDestinedReportDto.limit),
    ]);
    return { data: { reports, totalData, state: { page: getPreDestinedReportDto.page, limit: getPreDestinedReportDto.limit, page_limit: Math.ceil(totalData / getPreDestinedReportDto.limit) } }, message: responseMessage.getDataSuccess("report") };
  }

  async getReportById(id: string, queryFilter: GetPreDestinedReportFilterDto, paginationDto: PaginationDto) {
    const report = await this.reportModel.findOne({ _id: id });

    if (!report) {
      throw new BadRequestException(responseMessage.getDataNotFound("report"));
    }

    const parsedQuery = `return (function () {
      ${report.query}
      return ${report.query.match(this.getFunctionNameRegex)[1]}(executionParameters) 
    })()`;

    const [reports]: IReport[] = await new Function("executionParameters", parsedQuery)({ mongoose, schema: this.collections[report.collectionName], queryFilter, paginationDto });

    const { totalData, ...details } = reports;

    const filters = await this.reportFilterModel.find({ _id: { $in: report.filters.map((i) => i.id) } });

    const filterWithValues: Partial<IReportFilter>[] = [];

    for (const filter of filters) {
      const filterExecutionParameters: IFilterExecutionParameter = { schema: this.collections[filter.collectionName], filters: {} };
      if (report.name.includes(MatchFormat.ODI)) {
        filterExecutionParameters.filters.matchFormat = MatchFormat.ODI;
      }
      const parsedFn = `return (async function () {
        ${filter.queryToExecute}
        return ${filter.queryToExecute.match(this.getFunctionNameRegex)[1]}(filterExecutionParameters)
      })()`;
      const values = await new Function("filterExecutionParameters", parsedFn)(filterExecutionParameters);
      filterWithValues.push({ label: filter.label, values, isMultiSelectOption: filter.isMultiSelectOption, queryParameterKey: filter.queryParameterKey, type: filter.type });
    }

    return { data: { report: { name: report.name, details, filters: filterWithValues }, totalData, state: { page: paginationDto.page, limit: paginationDto.limit, page_limit: Math.ceil(totalData / paginationDto.limit) } }, message: responseMessage.getDataSuccess("report") };
  }
}
