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
import { MatchScoreboard } from '../database/model/match-scoreboard.model';
import { Venue } from '../database/model/venue.model';
import { MatchInfo } from '../database/model/match-info.model';
import { MatchAnalytics } from '../database/model/match-analytics.model';
import { RedisService } from '../redis/redis.service';

interface IFilterExecutionParameter {
  schema: string;
  filters: { matchFormat?: MatchFormat }
}

@Injectable()
export class ReportService {
  private readonly collections = {
    info: this.infoModel,
    player: this.playerModel,
    scoreboard: this.scoreboardModel,
    venue: this.venueModel,
    tournament: this.tournamentModel,
    team: this.teamModel,
    analytics: this.analyticsModel,
  }

  private readonly getFunctionNameRegex = /(?:function\s+|const\s+)([a-zA-Z0-9_$]+)\s*=?\s*(?:async\s*)?(?:function)?\s*\(/;

  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    @InjectModel(Tournament.name) private readonly tournamentModel: Model<Tournament>,
    @InjectModel(MatchInfo.name) private readonly infoModel: Model<MatchInfo>,
    @InjectModel(MatchScoreboard.name) private readonly scoreboardModel: Model<MatchScoreboard>,
    @InjectModel(Venue.name) private readonly venueModel: Model<Venue>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @InjectModel(MatchAnalytics.name) private readonly analyticsModel: Model<MatchAnalytics>,
    @InjectModel(ReportFilter.name) private readonly reportFilterModel: Model<ReportFilter>,
    private readonly redisService: RedisService,
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
      this.reportModel.find({}, { name: 1, uniqueKey: 1 }).skip((getPreDestinedReportDto.page - 1) * getPreDestinedReportDto.limit).limit(getPreDestinedReportDto.limit),
    ]);
    return { data: { reports, totalData, state: { page: getPreDestinedReportDto.page, limit: getPreDestinedReportDto.limit, page_limit: Math.ceil(totalData / getPreDestinedReportDto.limit) } }, message: responseMessage.getDataSuccess("report") };
  }

  async getReportByName(name: string, queryFilter: GetPreDestinedReportFilterDto, paginationDto: PaginationDto) {
    const report = await this.reportModel.findOne({ uniqueKey: name });

    if (!report) {
      throw new BadRequestException(responseMessage.getDataNotFound("report"));
    }

    const parsedQuery = `return (function () {
      ${report.query}
      return ${report.query.match(this.getFunctionNameRegex)[1]}(executionParameters) 
    })()`;

    const [reports]: IReport[] = await new Function("executionParameters", parsedQuery)({ mongoose, schema: this.collections[report.collectionName], scoreboardSchema: this.collections.scoreboard, queryFilter, paginationDto, matchInfoSchemaRef: this.collections.info, analyticsSchemaRef: this.collections.analytics, tournamentSchemaRef: this.collections.tournament, redisServiceRef: this.redisService });

    const { totalData, ...details } = reports;

    return { data: { report: { name: report.name, details }, totalData, state: { page: paginationDto.page, limit: paginationDto.limit, page_limit: Math.ceil(totalData / paginationDto.limit) } }, message: responseMessage.getDataSuccess("report") };
  }

  async getReportFiltersByName(name: string) {
    const report = await this.reportModel.findOne({ uniqueKey: name });

    if (!report) {
      throw new BadRequestException(responseMessage.getDataNotFound("report"));
    }

    const filterIds = report.filters.map((i) => i.id);
    const filters = await this.reportFilterModel.find({ _id: { $in: filterIds } }).lean();

    const filterWithValues: Partial<IReportFilter>[] = await Promise.all(
      filters.map(async (filter) => {
        const filterConfig = report.filters.find((i) => i.id.toString() === filter._id.toString()) || {};
        const filterExecutionParameters: IFilterExecutionParameter = {
          schema: this.collections[filter.collectionName],
          filters: { ...filterConfig }
        };

        delete filterExecutionParameters.filters['id'];

        const fnNameMatch = filter.queryToExecute.match(this.getFunctionNameRegex);
        if (!fnNameMatch) {
          throw new Error('Invalid filter query function');
        }
        const fnName = fnNameMatch[1];

        const parsedFn = `return (async function () {
        ${filter.queryToExecute}
        return ${fnName}(filterExecutionParameters)
      })()`;

        const values = await new Function("filterExecutionParameters", parsedFn)(filterExecutionParameters);

        return {
          values,
          ...filter,
          singleFilterConfig: filterConfig,
        };
      })
    );

    return { data: { report: { name: report.name, filters: filterWithValues } }, message: responseMessage.getDataSuccess("report filters") };
  }
}
