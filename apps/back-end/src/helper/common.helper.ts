import { IUser, IUserRole } from "@cricket-analysis-monorepo/interfaces";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { compare, genSaltSync, hash } from "bcrypt";
import { JwtPayload, sign } from "jsonwebtoken";
import { Model } from "mongoose";
import { User } from "../database/model/user.model";
import { responseMessage } from "./response-message.helper";
import { MatchInfo } from "../database/model/match-info.model";
import { Ball, MatchScoreboard } from "../database/model/match-scoreboard.model";
import Redis from "ioredis";
import { InjectRedis } from "@svtslv/nestjs-ioredis";
import { createHash } from "crypto";
import { MatchFormat, TournamentType } from "@cricket-analysis-monorepo/constants";
import { PaginationDto } from "./pagination.dto";
import { Tournament } from "../database/model/tournament.model";

interface IReportQueryFilter {
    startDate: string;
    endDate: string;
    batsmen: string;
    battingTeam: string | string[];
    bowlingTeam: string;
    competition: string | string[];
    over: string;
    venue: string | string[];
    bowler: string;
    matchFormat: MatchFormat;
    team: string;
    innings: string;
    tournamentType: TournamentType;
    season: string;
}

@Injectable()
export class CommonHelperService {
    private readonly logger: Logger = new Logger();

    constructor(private readonly configService: ConfigService, @InjectModel(User.name) private readonly userModel: Model<User>, @InjectModel(MatchScoreboard.name) private readonly matchScoreboardModel: Model<MatchScoreboard>,
        @InjectModel(MatchInfo.name) private readonly matchInfoModel: Model<MatchInfo>, @InjectRedis() private readonly redis: Redis) {
        this.JWT_TOKEN_SECRET = this.configService.get("JWT_TOKEN_SECRET");
    }

    private readonly JWT_TOKEN_SECRET;

    async generateHash(password = '') {
        const salt = genSaltSync(10);
        const hashPassword = await hash(password, salt);
        return hashPassword;
    }

    compareHash(password = '', hashPassword = '') {
        return compare(password, hashPassword);
    }

    generateToken = (data: JwtPayload) => {
        const token = sign(data, this.JWT_TOKEN_SECRET);
        return token;
    }

    async getUserById({ userId }: { userId: string }) {
        const user = await this.userModel.findOne<IUser>({ _id: userId }).populate<{ role: IUserRole }>("role");

        if (!user) {
            throw new BadRequestException(responseMessage.getDataNotFound("user"));
        }

        return { message: responseMessage.addDataSuccess("user details"), data: { user } };
    };

    checkMatchInfoAndScoreboardExists<T = Array<MatchScoreboard>>({ sheet_match_id, queryMethodName = "countDocuments" }: { sheet_match_id: string, queryMethodName?: string }): Promise<[Omit<MatchInfo, "tournamentId"> & {
        tournamentId: Pick<Tournament, "matchFormat">;
    }, T]> {
        return Promise.all([
            this.matchInfoModel.findOne({ match_id: sheet_match_id }).populate<{ tournamentId: Pick<Tournament, "matchFormat"> }>("tournamentId", "matchFormat"),
            this.matchScoreboardModel[queryMethodName]({ sheet_match_id, match_id: { $ne: null } }).lean(),
        ]);
    }

    ballsToOvers({ ballBowled }: { ballBowled: number }) {
        const completeOvers = Math.floor(ballBowled / 6);
        const remainingBalls = ballBowled % 6;
        return `${completeOvers}.${remainingBalls}`;
    }

    generateReportRedisCacheKey = (prefix: string, queryFilter: IReportQueryFilter, paginationDto: PaginationDto): string => {
        const keyBase = {
            ...queryFilter,
            page: paginationDto.page,
            limit: paginationDto.limit,
        };
        const keyStr = JSON.stringify(keyBase);
        const hash = createHash('md5').update(keyStr).digest('hex');
        return `${prefix}:${hash}`;
    };

    async deleteKeysContainingId(id: string) {
        let cursor = '0';
        const pattern = `*${id}*`; // Redis glob-style pattern

        do {
            const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
            cursor = nextCursor;

            if (keys.length > 0) {
                await this.redis.del(...keys);
                this.logger.log(`Deleted ${keys.length} keys matching pattern: ${pattern}`);
            }
        } while (cursor !== '0');
    }
}