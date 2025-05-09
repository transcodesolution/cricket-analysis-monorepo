import { MatchFormat } from "@cricket-analysis-monorepo/constants";
import { TournamentType } from "@cricket-analysis-monorepo/constants";

export interface ITeam {
    _id?: string;
    name: string;
    membersCount: number;
    captainId: string | null;
    shortName: string;
    formatPlayed: MatchFormat;
    tournamentType: TournamentType;
    foundedYear: string;
    logoUrl: string;
}