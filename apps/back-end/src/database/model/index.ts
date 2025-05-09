import { ModelDefinition } from "@nestjs/mongoose";
import { Tournament, TournamentSchema } from "./tournament.model";
import { Venue, VenueSchema } from "./venue.model";
import { Team, TeamSchema } from "./team.model";
import { Umpire, UmpireSchema } from "./umpire.model";
import { Referee, RefereeSchema } from "./referee.model";
import { Player, PlayerSchema } from "./player.model";
import { MatchInfo, MatchInfoSchema } from "./match-info.model";
import { MatchScoreboard, MatchScoreboardSchema } from "./match-scoreboard.model";
import { MatchAnalytics, MatchAnalyticsSchema } from "./match-analytics.model";
import { MappingData, MappingDataSchema } from "./mapping.model";
import { ReportFilter, ReportFilterSchema } from "./report-filters.model";
import { Report, ReportSchema } from "./report.model";
import { User, UserSchema } from "./user.model";
import { UserRole, UserRoleSchema } from "./user-role.model";

export const Model: ModelDefinition[] = [{ name: Tournament.name, schema: TournamentSchema, collection: Tournament.name }, { name: Venue.name, schema: VenueSchema, collection: Venue.name }, { name: Team.name, schema: TeamSchema, collection: Team.name }, { name: Umpire.name, schema: UmpireSchema, collection: Umpire.name }, { name: Referee.name, schema: RefereeSchema, collection: Referee.name }, { name: Player.name, schema: PlayerSchema, collection: Player.name }, { name: MatchInfo.name, schema: MatchInfoSchema, collection: MatchInfo.name }, { name: MatchScoreboard.name, schema: MatchScoreboardSchema, collection: MatchScoreboard.name }, { name: MatchAnalytics.name, schema: MatchAnalyticsSchema, collection: MatchAnalytics.name }, { name: MappingData.name, schema: MappingDataSchema, collection: MappingData.name }, { name: Report.name, schema: ReportSchema, collection: Report.name }, { name: ReportFilter.name, schema: ReportFilterSchema, collection: ReportFilter.name }, { name: User.name, schema: UserSchema, collection: User.name }, { name: UserRole.name, schema: UserRoleSchema, collection: UserRole.name }];