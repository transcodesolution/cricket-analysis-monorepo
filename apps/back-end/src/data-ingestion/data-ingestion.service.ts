import { BadRequestException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model, UpdateQuery } from 'mongoose';
import { DatabaseFields, RedisKey, UIInputRequiredFieldConfiguration } from './dto/constant.dto';
import { ColumnDto, MappingDetailDto, UploadFileAndMappingUpdateDto, UploadFileDto, UserMappingDetailDto, VerifyEntityNameDto } from './dto/mapping-data-ingestion.dto';
import { responseMessage } from '../helper/response-message.helper';
import { CachedInput, IMappingData, MappingData } from '../database/model/mapping.model';
import { Collection } from "mongoose";
import { Ball, MatchScoreboard } from '../database/model/match-scoreboard.model';
import { MatchAnalytics } from '../database/model/match-analytics.model';
import { Tournament } from '../database/model/tournament.model';
import { MatchInfo } from '../database/model/match-info.model';
import { Player } from '../database/model/player.model';
import { Referee } from '../database/model/referee.model';
import { Venue } from '../database/model/venue.model';
import { Team } from '../database/model/team.model';
import { Umpire } from '../database/model/umpire.model';
import { EntityType, MatchMethod, MatchStatus, UmpireSubType, UmpireType, WicketType } from '@cricket-analysis-monorepo/constants';
import { AnalyticsService } from './utils/analytics.service';
import { ICachedInput, IFileProgressData, IMatchSheetFormat } from '@cricket-analysis-monorepo/interfaces';
import { formatCsvFiles, formatExcelFiles, stripExt } from '@cricket-analysis-monorepo/service';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { ReportFilter } from '../database/model/report-filters.model';
import { Report } from '../database/model/report.model';
import { User } from '../database/model/user.model';
import { UserRole } from '../database/model/user-role.model';
import { IMulterFileObject } from './dto/interfaces';
import { CommonHelperService } from '../helper/common.helper';
import { Response } from 'express';
import { Queue } from 'bullmq';
import { QUEUES, TASKS } from '../helper/constant.helper';
import { InjectQueue } from '@nestjs/bullmq';
import { RedisService } from '../redis/redis.service';
import { SocketGateway } from '../socket/socket.service';

export interface IDataToUpdate { [keyname: string]: Record<string, string>[] | string | string[] };

@Injectable()
export class DataIngestionService {
  private readonly regexToMatchResult = /(wicket|run|tie|draw|noresult|suspend)/i;
  private readonly umpireMatchingRegexs = {
    reserveUmpireWord: /\b(reserve|standby|backup|alternate|fourth|support|substitute|spare)([_-]?umpire)?\b/i,
    offFieldUmpireWord: /\b(off[-_ ]?field|tv|third|support|backup|alternate|standby|substitute|spare)([-_ ]?umpire)?\b/i,
  };
  private readonly infoFileMatchingRegex = /info/i;

  private readonly missingInputs: Record<string, { [keyname: string]: { type: EntityType, keys: string[] } }> = {
    [MatchInfo.name]: {
      event: {
        type: EntityType.tournament,
        keys: ["matchFormat", "type", "event"]
      }
    },
  }

  private readonly enumValues: { [keyname: string]: string | null | object } = {
    [MatchInfo.name]: {
      "result.status": (sheetKeyName: string) => {
        const matchResult = sheetKeyName.match(this.regexToMatchResult);
        if (matchResult && matchResult[0] in MatchStatus) {
          return MatchStatus[matchResult[0] as keyof typeof MatchStatus];
        }
        return "";
      },
      "method": (value: string) => {
        return MatchMethod.DLS;
      }
    },
  }

  constructor(@InjectConnection() private readonly connection: Connection,
    @InjectModel(MappingData.name) private readonly mappedDataModel: Model<MappingData>,
    @InjectModel(Tournament.name) private readonly tournamentModel: Model<Tournament>,
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    @InjectModel(Umpire.name) private readonly umpireModel: Model<Umpire>,
    @InjectModel(Referee.name) private readonly refereeModel: Model<Referee>,
    @InjectModel(Venue.name) private readonly venueModel: Model<Venue>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(MatchScoreboard.name) private readonly matchScoreboardModel: Model<MatchScoreboard>,
    @InjectModel(MatchInfo.name) private readonly matchInfoModel: Model<MatchInfo>,
    @InjectQueue(QUEUES.fileUpload) private fileUploadQueue: Queue,
    private readonly socketGateway: SocketGateway,
    private readonly redisService: RedisService,
    private readonly analyticService: AnalyticsService,
    private readonly commonHelperService: CommonHelperService) { }

  extractNumbers(str: string) {
    const matches = str.match(/\d+/g);
    return matches ? matches.join('') : '';
  }

  extractScoreboardFileName(str: string) {
    const matches = str.match(/^.*?(\d+).*/);
    return matches ? matches[1] : '';
  }

  matchUmpireType(value: string) {
    const isOffField = this.umpireMatchingRegexs.offFieldUmpireWord.test(value);
    const isReserve = this.umpireMatchingRegexs.reserveUmpireWord.test(value);

    if (isOffField) return UmpireType.offfield;
    if (isReserve) return UmpireType.reserve;

    return UmpireType.none;
  }

  async updateScoreboardDataToDb(dataToUpdate: MatchScoreboard[], sheet_match_id: string, match_id: string | null = null, filterKeyName = "name") {
    const playerCache = new Map<string, string>();

    const getPlayerId = async (key: string): Promise<string> => {
      if (playerCache.has(key)) {
        return playerCache.get(key) || null;
      }
      const player = await this.playerModel.findOne({ [filterKeyName]: key }).lean();
      const playerId = player?._id?.toString();
      playerCache.set(key, playerId);
      return playerId;
    };

    const bulkOperations = [];

    for (const i of [...dataToUpdate]) {
      for (const j of i.balls) {
        j.bowler = await getPlayerId(j.bowler);
        j.bowler = new mongoose.Types.ObjectId(j.bowler) as unknown as string;

        j.striker.player = await getPlayerId(j.striker.player);
        j.striker.player = j.striker.player ? new mongoose.Types.ObjectId(j.striker.player) as unknown as string : null;

        j.non_striker.player = await getPlayerId(j.non_striker.player);
        j.non_striker.player = j.non_striker.player ? new mongoose.Types.ObjectId(j.non_striker.player) as unknown as string : null;

        if (j.wicket) {
          j.wicket.dismissedPlayer = await getPlayerId(j.wicket.dismissedPlayer);
          j.wicket.dismissedPlayer = j.wicket.dismissedPlayer ? new mongoose.Types.ObjectId(j.wicket.dismissedPlayer) as unknown as string : null;

          if (j.wicket.takenBy?.length > 0) {
            j.wicket.takenBy = await Promise.all(
              j.wicket.takenBy.map(async (player) => {
                const playerId = await getPlayerId(player);
                return playerId ? new mongoose.Types.ObjectId(playerId) as unknown as string : null;
              })
            );
          } else if ([WicketType.caught, WicketType.bowled, WicketType.caughtandbowled, WicketType.lbw, WicketType.hitwicket].includes(j.wicket.type)) {
            j.wicket.takenBy = [j.bowler];
          } else {
            j.wicket.takenBy = [];
          }
        }
      }
      i.match_id = match_id;
      i.sheet_match_id = sheet_match_id;

      bulkOperations.push({
        updateOne: {
          filter: { sheet_match_id, innings: i.innings, over: i.over },
          update: { $set: i },
          upsert: true,
        },
      });
    }

    if (bulkOperations.length > 0) {
      await this.matchScoreboardModel.bulkWrite(bulkOperations);
    }
  }

  extractEntitiesFromCombineFields(dataToUpdate: IMatchSheetFormat) {
    dataToUpdate["team1.playingEleven"] = dataToUpdate["team1.playingEleven"] || [];
    dataToUpdate["team2.playingEleven"] = dataToUpdate["team2.playingEleven"] || [];
    dataToUpdate["result.playerOfMatch"] = dataToUpdate["result.playerOfMatch"] || [];

    // handling extract all players from team1.playingEleven and team2.playingEleven

    let team1PlayingEleven: string[] = (dataToUpdate["team1.playingEleven"] as string[]).flatMap((i) => (i[1] === dataToUpdate["team1.team"] ? i[0] : []));
    let team2PlayingEleven: string[] = (dataToUpdate["team1.playingEleven"] as string[]).flatMap((i) => (i[1] === dataToUpdate["team2.team"] ? i[0] : []));
    team1PlayingEleven = (dataToUpdate["team2.playingEleven"] as string[]).flatMap((i) => (team1PlayingEleven.includes(i[0]) ? i[1] : []));
    team2PlayingEleven = (dataToUpdate["team2.playingEleven"] as string[]).flatMap((i) => (team2PlayingEleven.includes(i[0]) ? i[1] : []));

    const team1Players: Pick<Player, "name" | "uniqueId">[] = (dataToUpdate["team2.playingEleven"] as string[]).flatMap((i) => (team1PlayingEleven.includes(i[1]) ? { name: i[0], uniqueId: i[1] } : []))

    const team2Players: Pick<Player, "name" | "uniqueId">[] = (dataToUpdate["team2.playingEleven"] as string[]).flatMap((i) => (team2PlayingEleven.includes(i[1]) ? { name: i[0], uniqueId: i[1] } : []))

    // handling extract all player of matches from team2.playingEleven

    const playerOfMatches = (dataToUpdate["team2.playingEleven"] as string[]).flatMap((i) => (dataToUpdate["result.playerOfMatch"] as string[]).find((k) => i.includes(k[0])) ? i[1] : []);

    // handling extract all umpires from team2.playingEleven

    const bowledEndUmpireNames: string[] = (dataToUpdate["umpire.onFieldBowlerEndUmpire"] as string[]) ?? [];
    const legUmpireNames: string[] = (dataToUpdate["umpire.onFieldLegUmpire"] as string[]) ?? [];
    const fourthUmpireNames: string[] = (dataToUpdate["umpire.fourthUmpire"] as string[]) ?? [];
    const thirdUmpireNames: string[] = (dataToUpdate["umpire.thirdUmpire"] as string[]) ?? [];

    const allUmpiresNames = [...bowledEndUmpireNames, ...legUmpireNames, ...fourthUmpireNames, ...thirdUmpireNames];

    const bowledEndUmpireIds: string[] = (dataToUpdate["team2.playingEleven"] as string[]).flatMap((i) => bowledEndUmpireNames.includes(i[0]) ? i[1] : []);
    const legUmpireIds: string[] = (dataToUpdate["team2.playingEleven"] as string[]).flatMap((i) => legUmpireNames.includes(i[0]) ? i[1] : []);
    const fourthUmpireIds: string[] = (dataToUpdate["team2.playingEleven"] as string[]).flatMap((i) => fourthUmpireNames.includes(i[0]) ? i[1] : []);
    const thirdUmpireIds: string[] = (dataToUpdate["team2.playingEleven"] as string[]).flatMap((i) => thirdUmpireNames.includes(i[0]) ? i[1] : []);

    const onFieldUmpires = [...bowledEndUmpireIds, ...legUmpireIds];

    const umpires = (dataToUpdate["team2.playingEleven"] as Pick<Umpire, "name" | "uniqueId" | "type" | "subType">[]).flatMap<Pick<Umpire, "name" | "uniqueId" | "type" | "subType">>((i) => allUmpiresNames.includes(i[0]) ? { name: i[0], uniqueId: i[1], type: onFieldUmpires.includes(i[1]) ? UmpireType.onfield : thirdUmpireIds.includes(i[1]) ? UmpireType.reserve : fourthUmpireIds.includes(i[1]) ? UmpireType.offfield : UmpireType.none, subType: bowledEndUmpireIds.includes(i[1]) ? UmpireSubType.BOWLER_END : legUmpireIds.includes(i[1]) ? UmpireSubType.SQUARE_LEG : UmpireSubType.NONE } : []);

    // handling extract referee from team2.playingEleven

    const refereeName = dataToUpdate["referee"];
    const refereeObj = (dataToUpdate["team2.playingEleven"] as Pick<Referee, "name" | "uniqueId">[]).find((i) => refereeName === i[0]);

    return {
      playerOfMatches,
      player: {
        team1PlayingEleven,
        team2PlayingEleven,
        allPlayers: [...team1Players, ...team2Players],
      },
      umpire: {
        bowledEndUmpireIds,
        legUmpireIds,
        fourthUmpireIds,
        thirdUmpireIds,
        allUmpires: umpires,
      },
      referee: {
        name: refereeObj?.[0], uniqueId: refereeObj?.[1]
      },
    }
  }

  async saveMatchInformationToDb(dataToUpdate: IMatchSheetFormat, sheet_match_id: string, team1PlayingElevenIds: string[] = [], team2PlayingElevenIds: string[] = [], playerOfMatchIds: string[] = [], onFieldBowlerEndUmpires: string[] = [], onFieldLegUmpires: string[] = [], fourthUmpires: string[] = [], thirdUmpires: string[] = [], referee?: Pick<Referee, "name" | "uniqueId">) {
    const teams = await this.teamModel.find({ name: { $in: [dataToUpdate["team1.team"], dataToUpdate["team2.team"]] } });
    const team1 = teams.find((team) => team.name === dataToUpdate["team1.team"]);
    const team2 = teams.find((team) => team.name === dataToUpdate["team2.team"]);
    const eliminator = teams.find((team) => team.name === dataToUpdate["result.eliminator"]);
    const winningTeam = teams.find((team) => team.name === dataToUpdate["result.winningTeam"]);
    const tossWinningTeam = teams.find((team) => team.name === dataToUpdate["toss.winnerTeam"]);

    // handling referee
    const refereeObj = await this.refereeModel.findOne({ uniqueId: referee?.uniqueId }, "_id");

    // handling venue
    const venue = await this.venueModel.findOne({ name: dataToUpdate["venue"] });

    // handling tournamentId ref in match info table
    const tournament = await this.tournamentModel.findOne({ event: dataToUpdate["tournamentId"] });

    const team1PlayerIds = await this.playerModel.distinct("_id", { uniqueId: { $in: team1PlayingElevenIds } });
    const team2PlayerIds = await this.playerModel.distinct("_id", { uniqueId: { $in: team2PlayingElevenIds } });
    playerOfMatchIds = await this.playerModel.distinct("_id", { uniqueId: { $in: playerOfMatchIds } });

    const bowledEndUmpireIds = await this.umpireModel.distinct("_id", { uniqueId: { $in: onFieldBowlerEndUmpires } });
    const legUmpireIds = await this.umpireModel.distinct("_id", { uniqueId: { $in: onFieldLegUmpires } });
    const thirdUmpireIds = await this.umpireModel.distinct("_id", { uniqueId: { $in: thirdUmpires } });
    const fourthUmpireIds = await this.umpireModel.distinct("_id", { uniqueId: { $in: fourthUmpires } });

    // prepare match info object to save match detail in database
    const matchInfoObj = {
      ...dataToUpdate,
      "team1.team": team1?._id,
      "team2.team": team2?._id,
      "team1.playingEleven": team1PlayerIds,
      "team2.playingEleven": team2PlayerIds,
      "result.winningTeam": winningTeam?._id,
      "result.playerOfMatch": playerOfMatchIds,
      "result.eliminator": eliminator,
      'umpire.onFieldBowlerEndUmpire': bowledEndUmpireIds,
      'umpire.onFieldLegUmpire': legUmpireIds,
      'umpire.thirdUmpire': thirdUmpireIds,
      'umpire.fourthUmpire': fourthUmpireIds,
      venue: venue?._id,
      "toss.winnerTeam": tossWinningTeam?._id,
      match_id: sheet_match_id,
      tournamentId: tournament?._id,
      referee: refereeObj?._id,
    }

    // save match info data in database and update player team reference
    const matchInfo = new this.matchInfoModel(matchInfoObj);
    await Promise.all([
      matchInfo.save(),
      this.playerModel.updateMany({ _id: { $in: team1PlayerIds }, "teams.id": { $ne: team1?._id } }, { $push: { teams: { id: team1?._id } } }),
      this.playerModel.updateMany({ _id: { $in: team1PlayerIds }, "teams.id": { $ne: team2?._id } }, { $push: { teams: { id: team2?._id } } }),
    ]);

    return matchInfo._id;
  }

  async insertAllPlayers(players: Pick<Player, "name" | "uniqueId">[], gender?: string) {
    const bulkOperations = players.flatMap((i: { name: string, uniqueId: string }) => {
      if (!i.name && !i.uniqueId) {
        return [];
      }
      return {
        updateOne: {
          filter: { uniqueId: i.uniqueId },
          update: { $set: { ...i, gender } },
          upsert: true,
        },
      };
    });
    if (bulkOperations.length !== 0) {
      await this.playerModel.bulkWrite(bulkOperations);
    }
  }

  async insertAllUmpires(umpires: Pick<Umpire, "name" | "uniqueId" | "type" | "subType">[]) {
    const bulkOperations = umpires.flatMap((i) => {
      if (!i.name && !i.uniqueId) {
        return [];
      }
      return {
        updateOne: {
          filter: { uniqueId: i.uniqueId },
          update: { $set: i },
          upsert: true,
        },
      };
    });
    if (bulkOperations.length !== 0) {
      await this.umpireModel.bulkWrite(bulkOperations);
    }
  }

  async saveMappedDataToDb(collectionName: string, dataToUpdate: IMatchSheetFormat, match_id: string, scoreboardMappingFields: Record<string, string[]>, fileName: string, extension?: string) {
    switch (collectionName) {
      case Tournament.name:
        if (dataToUpdate?.event) {
          await this.tournamentModel.updateOne({ event: dataToUpdate.event }, { $set: dataToUpdate }, { upsert: true });
        }
        break;
      case MatchInfo.name:
        {
          const extractedEntities = this.extractEntitiesFromCombineFields(dataToUpdate);
          await Promise.all([
            this.saveMappedDataToDb(Team.name, dataToUpdate, match_id, scoreboardMappingFields, fileName),
            this.insertAllPlayers(extractedEntities.player.allPlayers),
            this.insertAllUmpires(extractedEntities.umpire.allUmpires),
            this.saveMappedDataToDb(Tournament.name, { event: dataToUpdate.tournamentId, ...dataToUpdate }, match_id, scoreboardMappingFields, fileName),
            this.saveMappedDataToDb(Venue.name, dataToUpdate, match_id, scoreboardMappingFields, fileName),
            this.refereeModel.updateOne({ uniqueId: extractedEntities.referee.uniqueId }, { $set: extractedEntities.referee }, { upsert: true }),
          ]);
          const matchInfoId = await this.saveMatchInformationToDb(dataToUpdate, match_id, extractedEntities.player.team1PlayingEleven, extractedEntities.player.team2PlayingEleven, extractedEntities.playerOfMatches, extractedEntities.umpire.bowledEndUmpireIds, extractedEntities.umpire.legUmpireIds, extractedEntities.umpire.fourthUmpireIds, extractedEntities.umpire.thirdUmpireIds, extractedEntities.referee);
          const scoreboardCount = await this.matchScoreboardModel.countDocuments({ sheet_match_id: match_id });
          if (scoreboardCount !== 0) {
            const scoreboard = await this.fetchScoreboardDetailFromSheet(match_id, null, scoreboardMappingFields, fileName, extension);
            await this.updateScoreboardDataToDb(scoreboard, match_id, matchInfoId.toString());
          }
          break;
        }
      case Player.name: {

        break;
      }
      case Umpire.name: {
        const bulkOperations = (dataToUpdate?.umpires as unknown as Pick<Umpire, "name" | "type" | "subType">[])?.flatMap((umpire: { name: string, type: UmpireType, subType?: UmpireSubType }) => {
          if (!umpire.name) {
            return [];
          }
          return {
            updateOne: {
              filter: { name: umpire.name },
              update: { $set: umpire },
              upsert: true,
            },
          };
        });
        if ((bulkOperations?.length || 0) !== 0) {
          await this.umpireModel.bulkWrite(bulkOperations);
        }
        break;
      }
      case Referee.name:
        if (dataToUpdate?.referee) {
          await this.refereeModel.updateOne({ name: dataToUpdate.referee }, { $set: { name: dataToUpdate.referee } }, { upsert: true });
        }
        break;
      case Venue.name:
        if (dataToUpdate?.venue) {
          await this.venueModel.updateOne({ name: dataToUpdate.venue }, { $set: { name: dataToUpdate.venue, city: dataToUpdate.city } }, { upsert: true });
        }
        break;
      case Team.name: {
        const bulkOperations = (dataToUpdate?.teams as unknown as Pick<Team, "name">[])?.flatMap((team: { name: string }) => {
          if (!team.name) {
            return [];
          }
          return {
            updateOne: {
              filter: { name: team.name },
              update: { $set: team },
              upsert: true,
            },
          };
        });
        if ((bulkOperations?.length || 0) !== 0) {
          await this.teamModel.bulkWrite(bulkOperations);
        }
        break;
      }
      case MatchScoreboard.name:
        {
          if ((dataToUpdate?.length || 0) !== 0) {
            const matchInfo = await this.matchInfoModel.findOne({ match_id });
            if (matchInfo) {
              const scoreboard = await this.fetchScoreboardDetailFromSheet(match_id, dataToUpdate, scoreboardMappingFields, fileName, extension);
              await this.updateScoreboardDataToDb(scoreboard, match_id, matchInfo._id.toString());
            } else {
              const scoreboard = await this.fetchScoreboardDetailFromSheet(match_id, dataToUpdate, scoreboardMappingFields, fileName, extension);
              await this.updateScoreboardDataToDb(scoreboard, match_id, null);
            }
          }
          break;
        }
      default:
        break;
    }
  }

  createNestedObject(path: string, value: string): object {
    const keys = path.split('.');
    const result = {};
    let current = result;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const isLast = i === keys.length - 1;

      if (key === '$') {
        continue;
      }

      const nextKey = keys[i + 1];
      const isNextArray = nextKey === '$';

      const obj = current;

      if (isLast || (isNextArray && i + 2 === keys.length)) {
        // Last key, or pattern like: key.$ (with no more nesting)
        obj[key] = isNextArray ? [value] : value;
        if (isNextArray) i++; // Skip $
      } else {
        const nested = {};
        if (isNextArray) {
          obj[key] = [nested];
          current = nested;
          i++; // Skip $
        } else {
          obj[key] = nested;
          current = nested;
        }
      }
    }

    return result;
  }

  deepMerge(target: object, source: object) {
    const output = { ...target };

    for (const key of Object.keys(source)) {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (Array.isArray(sourceValue)) {
        if (Array.isArray(targetValue)) {
          output[key] = [...targetValue, ...sourceValue];
        } else {
          output[key] = sourceValue;
        }
      } else if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
        if (targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
          output[key] = this.deepMerge(targetValue, sourceValue);
        } else {
          output[key] = sourceValue;
        }
      } else {
        output[key] = sourceValue;
      }
    }

    return output;
  }

  flushInnings(overGroups: Map<number, Partial<Ball>[]>, result: object[], currentInning: number, sheet_match_id: string) {
    for (const [o, balls] of overGroups.entries()) {
      result.push({
        over: o,
        sheet_match_id,
        innings: currentInning,
        balls
      });
    }
    overGroups.clear();
  }

  getExtension(fileName: string) {
    const ext = stripExt(fileName) === fileName
      ? '' // no extension
      : fileName.split('.').pop()?.toLowerCase() ?? '';
    return ext;
  }

  readExcelFiles = async <T = string>(
    file: ({ filename: string, readStream: T }),
  ): Promise<Record<string, IMatchSheetFormat>> => {
    const results: Record<string, IMatchSheetFormat> = {};

    const fileName = file.filename;
    const ext = this.getExtension(fileName);

    try {
      if (ext === 'csv') {
        await formatCsvFiles<T>(results, fileName, file.readStream);
      } else {
        // Excel (.xlsx) case
        formatExcelFiles<T>(results, file.readStream, fileName);
      }
    } catch (err) {
      console.error(`Error reading ${file.filename}:`, err);
      results[fileName] = {};
    }

    return results;
  };

  async fetchScoreboardDetailFromSheet(
    sheet_match_id: string,
    sheetScoreboardData: IMatchSheetFormat,
    fields: Record<string, string[]>,
    fileName: string,
    extension: string
  ) {
    const result = [];

    const scoreboardFilename = this.extractScoreboardFileName(fileName);
    if (!sheetScoreboardData) {
      if (scoreboardFilename) {
        const extractedSheetInfoString: string = await this.redisService.get(`${scoreboardFilename}:data`);
        sheetScoreboardData = JSON.parse(extractedSheetInfoString);
        sheetScoreboardData = sheetScoreboardData[`${scoreboardFilename}.${extension}`] as IMatchSheetFormat;
      } else {
        return [];
      }
    }

    const rows = sheetScoreboardData;

    if (!rows) {
      return [];
    }

    const sheetKeys = Object.keys(rows[0]);
    const overGroups = new Map<number, Partial<Ball>[]>();

    const inningKey = fields["innings"].find((k) => sheetKeys.includes(k));
    const ballKey = fields["balls.ball"].find((k) => sheetKeys.includes(k));
    const runKey = fields["balls.runs_off_bat"]?.find((k) => sheetKeys.includes(k));
    const overKey = fields["over"]?.find((k) => sheetKeys.includes(k));

    const keyMappings = Object.entries(fields).map(([dbKey, options]) => {
      const sheetKey = options.find((k) => sheetKeys.includes(k));
      return sheetKey ? { dbKey: dbKey.replace("balls.", ""), sheetKey } : null;
    }).filter(Boolean) as { dbKey: string; sheetKey: string }[];

    let currentInning = +rows[0][inningKey];

    for (const row of rows as unknown as object[]) {
      const inning = +row[inningKey];
      let [overStr, ballStr] = ["0", "0"];

      if (overKey) {
        overStr = row[overKey];
        ballStr = row[ballKey];
      } else if (!Number.isInteger(row[ballKey])) {
        [overStr, ballStr] = row[ballKey].toString().split(".");
      }

      const over = +overStr;

      if (Number.isNaN(over)) continue;

      // Inning switch — flush previous
      if (inning !== currentInning) {
        this.flushInnings(overGroups, result, currentInning, sheet_match_id);
        currentInning = inning;
      }

      let ballData: Partial<Ball> = {};

      for (const { dbKey, sheetKey } of keyMappings) {
        let value: string;
        if (sheetKey === inningKey) {
          continue;
        } else if (sheetKey === ballKey) {
          value = ballStr;
        } else {
          value = row[sheetKey];
        }
        ballData = this.deepMerge(ballData, this.createNestedObject(dbKey, value));
      }

      // Add fours/sixes if runs field is known
      const runs = runKey ? +row[runKey] : NaN;
      if (!Number.isNaN(runs)) {
        ballData.foursHit = runs === 4 ? 1 : 0;
        ballData.sixHit = runs === 6 ? 1 : 0;
      }

      if (!overGroups.has(over)) {
        overGroups.set(over, []);
      }

      const overGroup = overGroups.get(over);
      if (overGroup) {
        overGroup.push(ballData);
      }
    }

    // Final flush
    this.flushInnings(overGroups, result, currentInning, sheet_match_id);

    return result;
  }

  getFileName(fileName: string) {
    const fileSplitData = fileName.split(".");

    if (fileSplitData.length !== 2) {
      throw new BadRequestException(responseMessage.customMessage("Data not pass correctly"))
    }

    const [name] = fileSplitData;

    return name;
  }

  async checkMappingAndUpdate(mappingDetailDto: MappingDetailDto) {
    const { files } = mappingDetailDto;
    const { data } = await this.getAllDBSchemaNameWithFields({ isSoftwareCall: true });

    const regex = /info/i;
    const response: { unmappedKeys: string[], fileNames: string[] } = { unmappedKeys: [], fileNames: [] };

    await this.commonHelperService.deleteKeysContainingId("REPORTS_");

    const mappingDocs = await this.mappedDataModel.find({ collectionName: { $in: [MatchInfo.name, MatchScoreboard.name] } }).lean();

    let mainFileNameRequiredKey = "";

    for (const { fileName, columns } of files as ColumnDto[]) {
      const name = this.getFileName(fileName);

      const isInfoFile = regex.test(name);
      const matchedColumns = new Set<string>();

      const mappingDoc = mappingDocs.find((e) => e.collectionName === (isInfoFile ? MatchInfo.name : MatchScoreboard.name));

      const dbFields = data.find((e) => e.name === (isInfoFile ? MatchInfo.name : MatchScoreboard.name));

      for (const column of columns) {
        // Direct match
        if (dbFields.fields.includes(column)) {
          matchedColumns.add(column);
          continue;
        }

        // Mapped match
        for (const dbField in mappingDoc.fields) {
          const mappedSheetCols = mappingDoc.fields?.[dbField] || [];
          if (mappedSheetCols.includes(column)) {
            matchedColumns.add(column);
            break;
          }
        }
      }

      const requiredMappingColumns = columns.filter((col) => !matchedColumns.has(col));

      if (!mainFileNameRequiredKey && requiredMappingColumns.length !== 0) {
        mainFileNameRequiredKey = name;
      }

      response.unmappedKeys = [...new Set([...response.unmappedKeys, ...new Set(requiredMappingColumns)])];
      response.fileNames.push(fileName);
    }

    return {
      message: responseMessage.customMessage("mapping performed successfully"),
      data: response,
    };
  }

  async updateMappingAndCheckForUserInputFields(uploadFileAndMappingUpdateDto: UploadFileAndMappingUpdateDto, sheets: IMulterFileObject[]) {
    const { userMappingDetail } = uploadFileAndMappingUpdateDto;

    let mappingDetailRaw = userMappingDetail as unknown as string;
    if (mappingDetailRaw.startsWith("'") && mappingDetailRaw.endsWith("'")) {
      mappingDetailRaw = mappingDetailRaw.slice(1, -1);
    }

    const userMappingDetailDto: UserMappingDetailDto = JSON.parse(mappingDetailRaw);

    const cachedData = {
      [MatchInfo.name]: await this.mappedDataModel.findOne({ collectionName: MatchInfo.name }, "fields inputs"),
    }

    const missingInputKeys = Object.keys(this.missingInputs);

    const userInputRequiredFields: ICachedInput[] = [];

    // Step 1: Get all relevant collectionNames
    const collectionNames = userMappingDetailDto.mappingsByUser.map(j => j.collectionName);

    // Step 2: Fetch all in one query
    const existingDocs = await this.mappedDataModel
      .find({ collectionName: { $in: collectionNames } })
      .lean(); // plain JS objects for speed

    // Step 3: Index by collectionName
    const docMap = new Map(
      existingDocs.map(doc => [doc.collectionName, doc])
    );

    const bulkOperations = [];

    for (const j of userMappingDetailDto.mappingsByUser) {
      const doc = docMap.get(j.collectionName);
      if (!doc) continue;

      const fields = doc.fields || {};

      for (const key of Object.keys(j.fields)) {
        const existing = Array.isArray(fields[key]) ? fields[key] : [];
        const newValues = j.fields[key];

        // Merge without duplicates
        const merged = Array.from(new Set([...existing, ...newValues]));

        if (key === "event") {
          fields["tournamentId"] = Array.from(new Set([...fields["tournamentId"], ...newValues]));
        }
        fields[key] = merged;
      }

      bulkOperations.push({
        updateOne: {
          filter: { collectionName: j.collectionName },
          update: { $set: { fields } }
        }
      });
    }

    if (bulkOperations.length > 0) {
      await this.mappedDataModel.bulkWrite(bulkOperations);
    }

    for (const fileName of userMappingDetailDto.fileNames) {
      const name = this.getFileName(fileName);

      const currentSheetData = sheets.find((i) => i.filename.includes(fileName));

      if (!currentSheetData) {
        throw new BadRequestException(responseMessage.customMessage("please pass user mapping detail correctly! files uploaded and mapping detail must be equal length"))
      }

      currentSheetData.readStream = createReadStream(join("uploads/", currentSheetData.filename));

      const extractedSheetInfo = await this.readExcelFiles<ReadStream>(currentSheetData);

      await this.redisService.set(`${name}:data`, JSON.stringify(extractedSheetInfo));

      const isInfoFile = this.infoFileMatchingRegex.test(fileName);

      if (isInfoFile) {
        const sheetInformationKeys = Object.keys(extractedSheetInfo[fileName]);
        for (const key of missingInputKeys) {
          const obj = {};
          // check input reference key direct found in sheet information
          Object.keys(this.missingInputs[key]).forEach((k) => {
            const mappingKey = sheetInformationKeys.find((l) => cachedData[key].fields[k]?.includes(l));
            obj[mappingKey || k] = extractedSheetInfo[fileName][mappingKey || k]?.[0];
          });
          // check input key value direct found in sheet information
          const hasFoundCached = cachedData[key].inputs.some((inputCache: CachedInput) => obj[inputCache.referenceKey]?.toLowerCase()?.trim() === inputCache.referenceValue?.toLowerCase()?.trim());
          // final prepare user input required fields
          await Promise.all(Object.keys(obj).map(async (mappedKey) => {
            if (!hasFoundCached && mappedKey) {

              if (!obj[mappedKey]) {
                return;
              }

              const inputs = await Promise.all(this.missingInputs[key][mappedKey]?.keys?.map(async (inputKey) => (UIInputRequiredFieldConfiguration[inputKey]({ redisService: this.redisService }))));
              const isInputExist = userInputRequiredFields?.find((f) => f.collectionName === key && f.referenceKey === mappedKey && f.referenceValue === obj[mappedKey]);
              if (!isInputExist) {
                userInputRequiredFields.push({
                  referenceKey: mappedKey,
                  referenceValue: obj[mappedKey],
                  collectionName: key,
                  inputs,
                  fileId: fileName,
                  entityType: this.missingInputs[key][mappedKey]?.type
                });
              }
            }
          }));
        }
      }
    }

    return {
      message: responseMessage.customMessage("mapping updated successfully and user input fields checked successfully"),
      data: { userInputs: userInputRequiredFields, fileNames: userMappingDetailDto.fileNames },
    };
  }

  async getAllDBSchemaNameWithFields({ isSoftwareCall }: { isSoftwareCall: boolean }) {
    const excludedNames = [
      MappingData.name,
      MatchAnalytics.name,
      Report.name,
      ReportFilter.name,
      User.name,
      UserRole.name,
    ];

    const Query: mongoose.mongo.BSON.Document = {};

    if (isSoftwareCall) {
      Query.name = { $nin: excludedNames }
    } else {
      Query.name = { $in: [MatchInfo.name, MatchScoreboard.name] }
    }

    const collections = this.connection.db?.listCollections(Query, { nameOnly: true });
    const collectionNames = await collections?.toArray() as unknown as Collection[];

    const response = collectionNames.flatMap((i) => {
      return ({ name: i.name, fields: DatabaseFields[i.name as keyof typeof DatabaseFields]() });
    });

    return {
      message: responseMessage.getDataSuccess("Database schema names with fields"),
      data: response,
    };
  }

  updateInputToSaveInDatabase(
    dataToUpdate: IDataToUpdate,
    mappingKey: string,
    extractedSheetInfo: IMatchSheetFormat,
    inputs: CachedInput[] = [],
    collectionName: string,
    sheetKey: string
  ) {
    if (!mappingKey || !collectionName) return;

    const sheetValue = extractedSheetInfo[mappingKey]?.[0] || extractedSheetInfo[sheetKey]?.[0];
    if (!sheetValue) return;

    const input = inputs.find(i => i.referenceValue?.toLowerCase()?.trim() === sheetValue?.toLowerCase()?.trim());
    if (input && this.missingInputs[collectionName]?.[input.referenceKey]) {
      for (const inputValue of this.missingInputs[collectionName][input.referenceKey]?.keys || []) {
        dataToUpdate[inputValue] = input[inputValue];
        if (inputValue === "event") {
          dataToUpdate["tournamentId"] = input[inputValue];
        }
      }
    }
  }

  // Process mapping sheet data with database keys and save to database
  async processMappingSheetDataWithDatabaseKeys(fileName: string, extractedSheetInfo: IMatchSheetFormat, alreadyUploadCountRedisKey: string, extension: string) {
    // Extract unique number value from filename
    const match_id = this.extractNumbers(fileName);

    // If couldn't extract unique number value from filename, throw error
    if (!match_id) {
      throw new Error("couldn't get unique number value from filename");
    }

    // Check if file is info or scoreboard
    const isInfoFile = this.infoFileMatchingRegex.test(fileName);

    // Check if match info or scoreboard already exists in database
    const [matchInfo, scoreboardCount] = await this.commonHelperService.checkMatchInfoAndScoreboardExists<number>({ sheet_match_id: match_id });

    // If info file and match info already exists OR if scoreboard file and scoreboard already exists, skip processing
    if ((matchInfo && isInfoFile) || (!isInfoFile && scoreboardCount !== 0)) {
      await this.updateAlreadyUploadedFileCount(alreadyUploadCountRedisKey);
      await this.commonHelperService.deleteKeysContainingId(match_id);
      return { isFileProcessedSuccessfully: false };
    }

    const mappingDocs = await this.mappedDataModel.find({ collectionName: { $in: [MatchInfo.name, MatchScoreboard.name] } }); // get mapping documents for match info and scoreboard
    const mappingDoc = mappingDocs.find((m) => m.collectionName === MatchInfo.name); // get match info mapping document
    const scoreboardMappingDoc = mappingDocs.find((m) => m.collectionName === MatchScoreboard.name); // get scoreboard mapping document
    const sheetKeys = Object.keys(extractedSheetInfo); // get all keys from sheet information
    const collection: string[] = DatabaseFields[mappingDoc.collectionName](); // get all database fields for match info table
    if (isInfoFile) { // info file
      const dataToUpdate: IDataToUpdate = {};
      const dbMappingKeys = Object.keys(mappingDoc.fields);
      sheetKeys.forEach((value) => {
        let mappingKey = dbMappingKeys.find((k) => mappingDoc.fields[k]?.includes(value));
        if (mappingKey) {
          if (mappingKey === "team1.team" || mappingKey === "team2.team") { // for team table
            dataToUpdate["teams"] = [...(dataToUpdate["teams"] || []), { name: extractedSheetInfo[value][0] }] as Record<string, string>[];
            dataToUpdate[mappingKey] = extractedSheetInfo[value][0];
          } else if (mappingKey === "umpire.fourthUmpire" || mappingKey === "umpire.thirdUmpire" || mappingKey === "umpire.onFieldBowlerEndUmpire" || mappingKey === "umpire.onFieldLegUmpire") { // for umpire table
            dataToUpdate[mappingKey] = [...(dataToUpdate[mappingKey] || []), extractedSheetInfo[value][0]];
          } else if (mappingKey === "team2.playingEleven") { // for player table
            mappingKey = mappingKey.replace(".$", "");
            dataToUpdate[mappingKey] = [...(dataToUpdate[mappingKey] || []), extractedSheetInfo[value]] as string[];
          } else if (mappingKey.includes("playingEleven") || mappingKey.includes("playerOfMatch")) { // for match info table
            mappingKey = mappingKey.replace(".$", "");
            dataToUpdate[mappingKey] = [...(dataToUpdate[mappingKey] || []), extractedSheetInfo[value]] as string[];
          } else { // for match info table enum and normal fields
            let getValue = extractedSheetInfo[value][0];
            const enumValue = this.enumValues[mappingDoc.collectionName];
            if (mappingKey === "result.winBy") {
              const enumField = "result.status";
              const enumFunction = (enumValue)[enumField];
              dataToUpdate[enumField] = enumFunction(value);
            } else if (mappingKey === "method") {
              const enumFunction = (enumValue)[mappingKey];
              getValue = enumFunction(value);
            } else if (mappingKey === "result.status") {
              const enumFunction = (enumValue)[mappingKey];
              getValue = enumFunction(extractedSheetInfo[value][0]?.replace(/\s/g, "")?.trim());
            }
            dataToUpdate[mappingKey] = getValue;
            this.updateInputToSaveInDatabase(dataToUpdate, mappingKey, extractedSheetInfo, mappingDoc.inputs, mappingDoc.collectionName, value);
          }
        }
        else if (collection.includes(value)) { // for match info table normal fields
          let getValue = extractedSheetInfo[value][0];
          const enumValue = this.enumValues[mappingDoc.collectionName];
          if (value === "method") {
            const enumFunction = (enumValue)[value];
            getValue = enumFunction(value);
          }
          dataToUpdate[value] = getValue;
          this.updateInputToSaveInDatabase(dataToUpdate, value, extractedSheetInfo, mappingDoc.inputs, mappingDoc.collectionName, value);
        }
      });
      await this.saveMappedDataToDb(mappingDoc.collectionName, dataToUpdate, match_id, scoreboardMappingDoc.fields, fileName, extension);
    }
    else { // scoreboard file
      await this.saveMappedDataToDb(scoreboardMappingDoc.collectionName, extractedSheetInfo, match_id, scoreboardMappingDoc.fields, fileName, extension);
    }
    // After processing file delete redis key and generate analytics for match
    await this.analyticService.generateAnalyticsForMatch(match_id);
    return { isFileProcessedSuccessfully: true }
  }

  async updateAlreadyUploadedFileCount(alreadyUploadCountRedisKey: string) {
    let alreadyUploadingCount: number | string = await this.redisService.get(alreadyUploadCountRedisKey);
    alreadyUploadingCount = +(alreadyUploadingCount || 0) + 1;
    this.redisService.set(alreadyUploadCountRedisKey, alreadyUploadingCount.toString());
    return alreadyUploadingCount;
  }

  async updateMappingAndSaveInformationToDB(uploadFileDto: UploadFileDto, @Res() res: Response, requestUniqueId: string, userId: string) {
    const fileProgressData: IFileProgressData = { totalFilesProcessed: "0", totalErroredFiles: "0", totalAlreadyUploadedFiles: "0", totalFiles: uploadFileDto.fileNames.length, requestUniqueId };

    this.socketGateway.sendSocketMessage(userId, false, fileProgressData);

    const bulkInputOps = [];
    for (const userInput of uploadFileDto.userInputs) {
      const { collectionName, inputs, ...input } = userInput;

      Object.keys(this.missingInputs[collectionName])

      const update: UpdateQuery<IMappingData> = { $addToSet: { inputs: { ...input, ...inputs } } };

      if (input.isUserTypedValue) {
        bulkInputOps.push({
          updateOne: {
            filter: { collectionName: input.entityType },
            update: { $push: { names: input.typedValue } }
          }
        })
        const names = await this.redisService.lrange(RedisKey.TOURNAMENT_NAMES);
        names.push(input.typedValue);
        await this.redisService.del(RedisKey.TOURNAMENT_NAMES);
        await this.redisService.setList(RedisKey.TOURNAMENT_NAMES, names);
      }

      bulkInputOps.push({
        updateOne: {
          filter: { collectionName },
          update,
        }
      });
    }
    if (bulkInputOps.length > 0) {
      await this.mappedDataModel.bulkWrite(bulkInputOps);
    }

    for (const fileName of uploadFileDto.fileNames) {
      const name = this.getFileName(fileName);
      const ext = this.getExtension(fileName);

      const extractedSheetInfoString: string = await this.redisService.get(`${name}:data`);

      const extractedSheetInfo: Record<string, IMatchSheetFormat> = JSON.parse(extractedSheetInfoString);

      await this.fileUploadQueue.add(TASKS.processMappingSheetDataWithDatabaseKeys, { requestUniqueId, fileName: name, totalFiles: uploadFileDto.fileNames.length, fileData: extractedSheetInfo[fileName], userId, extension: ext }, { removeOnComplete: true, removeOnFail: true, delay: 6000 });
    }

    return res.status(HttpStatus.PARTIAL_CONTENT).json({
      message: responseMessage.customMessage("input updated successfully and files are processing to load in database"),
      data: {},
    });
  }

  normalize(str: string): string {
    return str.toLowerCase().trim().replace(/\s+/g, " ");
  }

  async verifyEntityName(verifyEntityNameDto: VerifyEntityNameDto) {
    const mappedData = await this.mappedDataModel.findOne({
      collectionName: verifyEntityNameDto.entityType,
    });

    if (!mappedData) {
      throw new BadRequestException(responseMessage.getDataNotFound('entity'));
    }

    // Normalize names (lowercase)
    const normalizedNames = mappedData.names.map((n: string) => this.normalize(n));
    const userInput = this.normalize(verifyEntityNameDto.name);

    if (normalizedNames.includes(userInput)) {
      throw new BadRequestException(
        responseMessage.dataAlreadyExist('entity name'),
      );
    }

    return {
      message: responseMessage.dataVerifiedSuccess(
        `${verifyEntityNameDto.entityType} name`,
      ),
      data: {},
    };
  }
}