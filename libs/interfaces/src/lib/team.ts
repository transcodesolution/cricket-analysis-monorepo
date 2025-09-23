import { MatchFormat, TournamentType } from "@cricket-analysis-monorepo/constants";

export interface ITeam {
    _id?: string;
    fullName: string;
    membersCount: number;
    captainId: string;
    shortName: string;
    formatPlayed: MatchFormat;
    tournamentType: TournamentType;
    foundedYear: string;
    logoUrl: string;
}