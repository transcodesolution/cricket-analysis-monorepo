import { BadRequestException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { DatabaseFields, UIInputRequiredFieldConfiguration } from './dto/constant.dto';
import { ColumnDto, InputUpdateDto, MappingDetailDto, UploadFileAndMappingUpdateDto, UploadFileDto, UserMappingDetailDto } from './dto/mapping-data-ingestion.dto';
import { responseMessage } from '../helper/response-message.helper';
import { CachedInput, MappingData } from '../database/model/mapping.model';
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
import { MatchMethod, MatchStatus, UmpireSubType, UmpireType, WicketType } from '@cricket-analysis-monorepo/constants';
import { AnalyticsService } from './utils/analytics.service';
import { ICachedInput, IMatchSheetFormat, IUploadResult } from '@cricket-analysis-monorepo/interfaces';
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

export interface IDataToUpdate { [keyname: string]: Record<string, string>[] | string };

@Injectable()
export class DataIngestionService {
  private readonly regexToMatchResult = /(wicket|run|tie|draw)/i;
  private readonly umpireMatchingRegexs = {
    reserveUmpireWord: /\b(reserve|standby|backup|alternate|fourth|support|substitute|spare)([_-]?umpire)?\b/i,
    offFieldUmpireWord: /\b(off[-_ ]?field|tv|third|support|backup|alternate|standby|substitute|spare)([-_ ]?umpire)?\b/i,
  };
  private readonly infoFileMatchingRegex = /info/i;

  private readonly missingInputs: Record<string, { [keyname: string]: string[] }> = {
    [Tournament.name]: { event: ["matchFormat", "type"] },
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
    private readonly analyticService: AnalyticsService,
    private readonly commonHelperService: CommonHelperService) { }

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

  async saveMatchInformationToDb(dataToUpdate: IMatchSheetFormat, sheet_match_id: string) {
    const teams = await this.teamModel.find({ name: { $in: [dataToUpdate["team1.team"], dataToUpdate["team2.team"]] } });
    const team1 = teams.find((team) => team.name === dataToUpdate["team1.team"]);
    const team2 = teams.find((team) => team.name === dataToUpdate["team2.team"]);
    const winningTeam = teams.find((team) => team.name === dataToUpdate["result.winningTeam"]);
    const tossWinningTeam = teams.find((team) => team.name === dataToUpdate["toss.winnerTeam"]);
    const team1PlayingEleven = await this.playerModel.distinct("_id", { name: { $in: dataToUpdate["team1.playingEleven"] } });
    const team2PlayingEleven = await this.playerModel.distinct("_id", { name: { $in: dataToUpdate["team2.playingEleven"] } });
    const playerOfMatches = await this.playerModel.distinct("_id", { name: { $in: dataToUpdate["result.playerOfMatch"] } });
    const onFieldBowlerEndUmpire = await this.umpireModel.findOne({ name: dataToUpdate["umpire.onFieldBowlerEndUmpire"] });
    const onFieldLegUmpire = await this.umpireModel.findOne({ name: dataToUpdate["umpire.onFieldLegUmpire"] });
    const fourthUmpire = await this.umpireModel.findOne({ name: dataToUpdate["umpire.fourthUmpire"] });
    const thirdUmpire = await this.umpireModel.findOne({ name: dataToUpdate["umpire.thirdUmpire"] });
    const venue = await this.venueModel.findOne({ name: dataToUpdate["venue"] });
    const tournament = await this.tournamentModel.findOne({ event: dataToUpdate["tournamentId"] });
    const referee = await this.refereeModel.findOne({ name: dataToUpdate["referee"] });
    const matchInfoObj = {
      ...dataToUpdate,
      "team1.team": team1?._id,
      "team2.team": team2?._id,
      "team1.playingEleven": team1PlayingEleven,
      "team2.playingEleven": team2PlayingEleven,
      "result.winningTeam": winningTeam?._id,
      "result.playerOfMatch": playerOfMatches,
      'umpire.onFieldBowlerEndUmpire': onFieldBowlerEndUmpire?._id,
      'umpire.onFieldLegUmpire': onFieldLegUmpire?._id,
      'umpire.thirdUmpire': fourthUmpire?._id,
      'umpire.fourthUmpire': thirdUmpire?._id,
      venue: venue?._id,
      "toss.winnerTeam": tossWinningTeam?._id,
      match_id: sheet_match_id,
      tournamentId: tournament?._id,
      referee: referee?._id,
    }
    const matchInfo = new this.matchInfoModel(matchInfoObj);
    await Promise.all([
      matchInfo.save(),
      this.playerModel.updateMany({ _id: { $in: team1PlayingEleven }, "teams.id": { $ne: team1?._id } }, { $push: { teams: { id: team1?._id } } }),
      this.playerModel.updateMany({ _id: { $in: team2PlayingEleven }, "teams.id": { $ne: team2?._id } }, { $push: { teams: { id: team2?._id } } }),
    ]);
    return matchInfo._id;
  }

  async saveMappedDataToDb(collectionName: string, dataToUpdate: IMatchSheetFormat, match_id: string, scoreboardMappingFields: Record<string, string[]>, scoreboardDetail?: IMatchSheetFormat) {
    switch (collectionName) {
      case Tournament.name:
        if (dataToUpdate?.event && dataToUpdate?.season) {
          dataToUpdate.season = dataToUpdate.season.toString().slice(0, 4);
          await this.tournamentModel.updateOne({ event: dataToUpdate.event, season: dataToUpdate.season }, { $set: dataToUpdate }, { upsert: true });
        }
        break;
      case MatchInfo.name:
        {
          const matchInfoId = await this.saveMatchInformationToDb(dataToUpdate, match_id);
          const scoreboardCount = await this.matchScoreboardModel.countDocuments({ sheet_match_id: match_id });
          if (scoreboardCount !== 0) {
            const scoreboard = await this.fetchScoreboardDetailFromSheet(match_id, scoreboardDetail, scoreboardMappingFields);
            await this.updateScoreboardDataToDb(scoreboard, match_id, matchInfoId.toString());
          }
          break;
        }
      case Player.name: {
        const bulkOperations = (dataToUpdate?.registry as unknown as Pick<Player, "name" | "uniqueId">[])?.flatMap((i: { name: string, uniqueId: string }) => {
          if (!i.name && !i.uniqueId) {
            return [];
          }
          return {
            updateOne: {
              filter: { uniqueId: i.uniqueId, name: i.name },
              update: { $set: { ...i, gender: dataToUpdate.gender } },
              upsert: true,
            },
          };
        });
        if ((bulkOperations?.length || 0) !== 0) {
          await this.playerModel.bulkWrite(bulkOperations);
        }
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
        if (dataToUpdate?.name) {
          await this.refereeModel.updateOne({ name: dataToUpdate.name }, { $set: dataToUpdate }, { upsert: true });
        }
        break;
      case Venue.name:
        if (dataToUpdate?.name) {
          await this.venueModel.updateOne({ name: dataToUpdate.name }, { $set: dataToUpdate }, { upsert: true });
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
              const scoreboard = await this.fetchScoreboardDetailFromSheet(match_id, dataToUpdate, scoreboardMappingFields);
              await this.updateScoreboardDataToDb(scoreboard, match_id, matchInfo._id.toString());
            } else {
              const scoreboard = await this.fetchScoreboardDetailFromSheet(match_id, dataToUpdate, scoreboardMappingFields);
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


  readExcelFiles = async <T = string>(
    file: ({ filename: string, readStream: T }),
  ): Promise<Record<string, IMatchSheetFormat>> => {
    const results: Record<string, IMatchSheetFormat> = {};

    const baseName = stripExt(file.filename);
    const ext = stripExt(file.filename) === file.filename
      ? '' // no extension
      : file.filename.split('.').pop()?.toLowerCase() ?? '';

    try {
      if (ext === 'csv') {
        await formatCsvFiles<T>(results, baseName, file.readStream);
      } else {
        // Excel (.xlsx) case
        formatExcelFiles<T>(results, file.readStream, baseName);
      }
    } catch (err) {
      console.error(`Error reading ${file.filename}:`, err);
      results[baseName] = {};
    }

    return results;
  };

  async fetchScoreboardDetailFromSheet(
    sheet_match_id: string,
    sheetScoreboardData: IMatchSheetFormat,
    fields: Record<string, string[]>
  ) {
    const result = [];

    if (!sheetScoreboardData) {
      const fileName = `${sheet_match_id}.csv`;
      const fileData = await this.readExcelFiles<ReadStream>({ filename: fileName, readStream: createReadStream(join("uploads/", fileName)) });
      sheetScoreboardData = fileData[sheet_match_id];
    }

    const rows = sheetScoreboardData;
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

  async checkMappingAndUpdate(mappingDetailDto: MappingDetailDto) {
    const { files } = mappingDetailDto;
    const { data } = await this.getAllDBSchemaNameWithFields();

    const regex = /info/i;
    const unmappedData: Record<string, string[]> = {};

    const mappedDataCache = new Map<string, Record<string, string[]>>();

    const matchInfoFields = [
      { collectionName: Venue.name, field: "name", infoRefField: "venue" },
      { collectionName: Referee.name, field: "name", infoRefField: "referee" },
      { collectionName: Umpire.name, field: "name", infoRefField: "umpire.onFieldBowlerEndUmpire" },
      { collectionName: Umpire.name, field: "name", infoRefField: "umpire.onFieldLegUmpire" },
      { collectionName: Umpire.name, field: "name", infoRefField: "umpire.thirdUmpire" },
      { collectionName: Umpire.name, field: "name", infoRefField: "umpire.fourthUmpire" },
      { collectionName: Team.name, field: "name", infoRefField: "team1.team" },
      { collectionName: Team.name, field: "name", infoRefField: "team2.team" },
    ];

    for (const { fileName, columns } of files as ColumnDto[]) {
      const isInfoFile = regex.test(fileName);
      const matchedColumns = new Set<string>();

      for (const { name, fields } of data) {
        if ((isInfoFile && name !== MatchScoreboard.name) || !isInfoFile) {
          // Check if mapping exists for this collection
          if (!mappedDataCache.has(name)) {
            const mappingDoc = await this.mappedDataModel.findOne({ collectionName: name });
            mappedDataCache.set(name, mappingDoc?.fields || {});
          }
          const mappingFields = mappedDataCache.get(name);

          for (const column of columns) {
            // Direct match
            if (fields.includes(column)) {
              matchedColumns.add(column);
              continue;
            }

            // Mapped match
            for (const dbField of fields) {
              const mappedSheetCols = mappingFields?.[dbField] || [];
              if (mappedSheetCols.includes(column)) {
                matchedColumns.add(column);
                break;
              }
            }
          }
        }
      }

      // Remaining unmapped columns
      unmappedData[fileName] = columns.filter((col) => !matchedColumns.has(col));
    }

    return {
      message: responseMessage.customMessage("mapping performed successfully"),
      data: unmappedData,
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
      [Tournament.name]: await this.mappedDataModel.findOne({ collectionName: Tournament.name }, "fields inputs")
    }

    const missingInputKeys = Object.keys(this.missingInputs);

    const userInputRequiredFields: Record<string, ICachedInput[]> = {};

    for (const i of userMappingDetailDto.files) {
      const { fileName, mappingsByUser } = i;

      userInputRequiredFields[fileName] = userInputRequiredFields[fileName] || [];

      const currentSheetData = sheets.find((i) => i.filename.includes(fileName));

      if (!currentSheetData) {
        throw new BadRequestException(responseMessage.customMessage("please pass user mapping detail correctly! files uploaded and mapping detail must be equal length"))
      }

      // Step 1: Get all relevant collectionNames
      const collectionNames = mappingsByUser.map(j => j.collectionName);

      // Step 2: Fetch all in one query
      const existingDocs = await this.mappedDataModel
        .find({ collectionName: { $in: collectionNames } })
        .lean(); // plain JS objects for speed

      // Step 3: Index by collectionName
      const docMap = new Map(
        existingDocs.map(doc => [doc.collectionName, doc])
      );

      const bulkOperations = [];

      for (const j of mappingsByUser) {
        const doc = docMap.get(j.collectionName);
        if (!doc) continue;

        const fields = doc.fields || {};

        for (const key of Object.keys(j.fields)) {
          const existing = Array.isArray(fields[key]) ? fields[key] : [];
          const newValues = j.fields[key];

          // Merge without duplicates
          const merged = Array.from(new Set([...existing, ...newValues]));

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

      currentSheetData.readStream = createReadStream(join("uploads/", currentSheetData.filename));

      const extractedSheetInfo = await this.readExcelFiles<ReadStream>(currentSheetData);

      const isInfoFile = this.infoFileMatchingRegex.test(fileName);

      if (isInfoFile) {
        const sheetInformationKeys = Object.keys(extractedSheetInfo[fileName]);
        for (const key of missingInputKeys) {
          const obj = {};
          // check input reference key direct found in sheet information
          Object.keys(this.missingInputs[key]).forEach((k) => {
            const mappingKey = sheetInformationKeys.find((l) => cachedData[key].fields[k]?.includes(l));
            obj[mappingKey || k] = extractedSheetInfo[fileName][mappingKey || k][0];
          });
          // check input key value direct found in sheet information
          const hasFoundCached = cachedData[key].inputs.some((inputCache: CachedInput) => obj[inputCache.referenceKey]?.toLowerCase().trim() === inputCache.referenceValue.toLowerCase().trim());
          // final prepare user input required fields
          Object.keys(obj).forEach((mappedKey) => {
            if (!hasFoundCached) {
              const inputs = this.missingInputs[key][mappedKey]?.map((inputKey) => (UIInputRequiredFieldConfiguration[inputKey]()));
              userInputRequiredFields[fileName].push({
                referenceKey: mappedKey,
                referenceValue: obj[mappedKey],
                collectionName: key,
                inputs,
              });
            }
          });
        }
      }
    }

    return {
      message: responseMessage.customMessage("mapping updated successfully and user input fields checked successfully"),
      data: userInputRequiredFields,
    };
  }

  async getAllDBSchemaNameWithFields() {
    const collections = this.connection.db?.listCollections({}, { nameOnly: true });
    const collectionNames = await collections?.toArray() as unknown as Collection[];

    const excludedNames = [
      MappingData.name,
      MatchAnalytics.name,
      Report.name,
      ReportFilter.name,
      User.name,
      UserRole.name,
    ];

    const response = collectionNames.flatMap((i) => {
      if (excludedNames.includes(i.name)) { return []; }
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
    collectionName: string
  ) {
    if (!mappingKey || !collectionName) return;

    const sheetValue = extractedSheetInfo[mappingKey]?.[0];
    if (!sheetValue) return;

    const input = inputs.find(i => i.referenceValue?.toLowerCase().trim() === sheetValue?.toLowerCase().trim());
    if (input && this.missingInputs[collectionName]?.[input.referenceKey]) {
      for (const inputValue of this.missingInputs[collectionName][input.referenceKey]) {
        dataToUpdate[inputValue] = input[inputValue];
      }
    }
  }

  async processMappingSheetDataWithDatabaseKeys(fileName: string, extractedSheetInfo: IMatchSheetFormat) {
    try {
      const match_id = this.getMatchId(fileName);
      const mappings = await this.mappedDataModel.find();
      const index = mappings.findIndex((i) => i.collectionName === MatchInfo.name);
      if (index !== -1) {
        const [removedElement] = mappings.splice(index, 1);
        mappings.push(removedElement);
      }
      const isInfoFile = this.infoFileMatchingRegex.test(fileName);
      const scoreboardMappingFields = (mappings.find((key) => key.collectionName === MatchScoreboard.name)).fields;
      for (const j of mappings) {
        const collection: string[] = DatabaseFields[j.collectionName]();
        if (isInfoFile) {
          const dataToUpdate: IDataToUpdate = {};
          const dbMappingKeys = Object.keys(j.fields);
          Object.keys(extractedSheetInfo).forEach((value) => {
            let mappingKey = dbMappingKeys.find((k) => j.fields[k]?.includes(value));
            // enum manage for result
            // if (enumMappingKey) {
            //   if (enumValue && typeof enumValue === 'object' && enumMappingKey in enumValue) {
            //     dataToUpdate[enumMappingKey] = enumFunction(value);
            //   }
            // }
            if (mappingKey) {
              if (j.collectionName === Team.name) {
                dataToUpdate["teams"] = [...(dataToUpdate["teams"] || []), { [mappingKey]: extractedSheetInfo[value][0] }] as Record<string, string>[];
              } else if (j.collectionName === Umpire.name) {
                if (this.matchUmpireType(value)) {
                  dataToUpdate["umpires"] = [...(dataToUpdate["umpires"] || []), { [mappingKey]: extractedSheetInfo[value][0], type: this.matchUmpireType(value) }] as Record<string, string>[];
                } else {
                  dataToUpdate["umpires"] = [...(dataToUpdate["umpires"] || []), { [mappingKey]: extractedSheetInfo[value][0], type: UmpireType.onfield, subType: value.includes("1") ? UmpireSubType.BOWLER_END : UmpireSubType.SQUARE_LEG }] as Record<string, string>[];
                }
              } else if (j.collectionName === Player.name) {
                if ((extractedSheetInfo[value] as string[]).length > 1) {
                  dataToUpdate["registry"] = [...(dataToUpdate["registry"] || []), { name: extractedSheetInfo[value][0], uniqueId: extractedSheetInfo[value][1] }] as Record<string, string>[];
                }
                else {
                  dataToUpdate[mappingKey] = extractedSheetInfo[value][0];
                }
              } else if (mappingKey?.includes("playingEleven") || mappingKey?.includes("playerOfMatch")) {
                mappingKey = mappingKey.replace(".$", "");
                dataToUpdate[mappingKey] = [...(dataToUpdate[mappingKey] || []), extractedSheetInfo[value][0]];
              } else {
                const enumValue = this.enumValues[j.collectionName];
                if (mappingKey === "result.winBy") {
                  const enumField = "result.status";
                  const enumFunction = (enumValue)[enumField];
                  dataToUpdate[enumField] = enumFunction(value);
                } else if (mappingKey === "method") {
                  const enumFunction = (enumValue)[mappingKey];
                  dataToUpdate[mappingKey] = enumFunction(value);
                }
                dataToUpdate[mappingKey] = extractedSheetInfo[value][0];
              }
              this.updateInputToSaveInDatabase(dataToUpdate, mappingKey, extractedSheetInfo, j.inputs, j.collectionName);
            }
            else if (collection.includes(value)) {
              const enumValue = this.enumValues[j.collectionName];
              if (value === "method") {
                const enumFunction = (enumValue)[value];
                dataToUpdate[value] = enumFunction(value);
              }
              else {
                dataToUpdate[value] = extractedSheetInfo[value][0];
              }
              this.updateInputToSaveInDatabase(dataToUpdate, value, extractedSheetInfo, j.inputs, j.collectionName);
            }
          });
          await this.saveMappedDataToDb(j.collectionName, dataToUpdate, match_id, scoreboardMappingFields);
        }
        else if (j.collectionName === MatchScoreboard.name) {
          await this.saveMappedDataToDb(j.collectionName, extractedSheetInfo, match_id, scoreboardMappingFields);
        }
      }
      await this.analyticService.generateAnalyticsForMatch(match_id);
      return Promise.resolve({});
    } catch (error) {
      console.error("Date & Time Log : ", new Date());
      console.error("processMappingSheetDataWithDatabaseKeys error : ", error);
      return Promise.reject(error.message);
    }
  }

  getMatchId(fileName: string) {
    return fileName.split("_")[0];
  }

  async updateMappingAndSaveInformationToDB(uploadFileDto: UploadFileDto, @Res() res: Response) {
    const uploadResult: IUploadResult[] = [];

    for (const i of Object.keys(uploadFileDto)) {
      const fileName = i;
      const uploadFileObj = uploadFileDto[fileName];

      const fileNameWithExtension = `${fileName}.csv`;

      const readStream = createReadStream(join("uploads/", fileNameWithExtension));

      const extractedSheetInfo = await this.readExcelFiles<ReadStream>({ filename: fileNameWithExtension, readStream });

      const match_id = this.getMatchId(fileName);
      const isInfoFile = this.infoFileMatchingRegex.test(fileName);

      const bulkInputOps = [];
      for (const key in uploadFileObj) {
        const { collectionName, inputs, ...input }: InputUpdateDto = uploadFileObj[key];

        bulkInputOps.push({
          updateOne: {
            filter: { collectionName },
            update: { $addToSet: { inputs: { ...input, ...inputs } } }
          }
        });
      }
      if (bulkInputOps.length > 0) {
        await this.mappedDataModel.bulkWrite(bulkInputOps);
      }

      const [matchInfo, scoreboardCount] = await this.commonHelperService.checkMatchInfoAndScoreboardExists({ sheet_match_id: match_id });

      if ((matchInfo && isInfoFile) || (!isInfoFile && scoreboardCount !== 0)) {
        uploadResult.push({ hasAlreadyUploaded: true, fileName, message: responseMessage.dataAlreadyUploaded("file") });
        continue;
      }

      uploadResult.push({ hasAlreadyUploaded: false, fileName, message: responseMessage.customMessage("Process started to load data in database") });
      this.processMappingSheetDataWithDatabaseKeys(fileName, extractedSheetInfo[fileName])
        .catch((err) => {
          console.error("processMappingSheetDataWithDatabaseKeys method: Background processing task failed:", err);
        });
    }

    const alreadyUpload = uploadResult.filter((i) => i.hasAlreadyUploaded).map((i) => i.fileName);

    if (alreadyUpload.length > 0) {
      return res.status(HttpStatus.PARTIAL_CONTENT).json({
        statusCode: HttpStatus.PARTIAL_CONTENT,
        message: "Mapping performed successfully and files $fileNames are already uploaded, Rest are processing to load data".replace("$fileNames", alreadyUpload.join(", ")),
        data: uploadResult,
      });
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: responseMessage.customMessage("mapping updated successfully and sheet data is processing to load in database"),
      data: uploadResult,
    });
  }
}
