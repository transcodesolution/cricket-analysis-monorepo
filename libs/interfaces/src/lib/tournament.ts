import { Country, MatchFormat, TournamentBoard, TournamentType } from "@cricket-analysis-monorepo/constants";

export interface OrganizerDetails {
    contact: string;
    countryCode: string;
    email: string;
    name: string;
}

export interface ITournament {
    event: string;
    gender: string;
    organizerDetails: OrganizerDetails;
    endDate: Date | null;
    startDate: Date | null;
    logo: string;
    season: string;
    board: TournamentBoard;
    type: TournamentType;
    country: Country;
    matchFormat: MatchFormat;
}