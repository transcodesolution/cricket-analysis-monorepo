import { Country, MatchFormat, TournamentBoard, TournamentType, Gender } from "@cricket-analysis-monorepo/constants";

export interface IOrganizerDetails {
    contact: string;
    countryCode: string;
    email: string;
    name: string;
}

export interface ITournament {
    _id?: string;
    event: string;
    gender: Gender;
    organizerDetails: IOrganizerDetails;
    startDate: Date;
    endDate: Date;
    logo: string;
    season: string;
    board: TournamentBoard;
    type: TournamentType;
    country: Country;
    matchFormat: MatchFormat;
}