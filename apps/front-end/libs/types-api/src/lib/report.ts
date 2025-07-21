import { IReportFilter } from "@cricket-analysis-monorepo/interfaces";

export interface IGetReportRequest {
  page: number;
  limit: number;
}

export interface IReport {
  _id: string,
  name: string,
  uniqueKey: string
}
export interface IGetReportsResponse {
  reports: IReport[];
  totalData: number;
}

export interface IGetReportByIdRequest {
  page?: number;
  limit?: number;
  [key: string]: string | number | string[] | undefined;
  id: string
}

export interface ITableHeader {
  label: string;
  value: string;
}

export interface ITableRow {
  [key: string]: string | number;
}

export interface IRunTypeStats {
  runs: number;
  balls: number;
  perMatch?: number;
  perInns?: number;
}

export interface IRunDistribution {
  [runType: string]: IRunTypeStats | undefined;
}

export interface IScoringDistribution {
  [range: string]: number; // e.g., "0+": 100, "10+": 62.5
}

export interface IBatsmanRecentGames {
  date: string;
  battingTeam: string;
  bowlingTeam: string;
  dismissal: string;
  '0s': number;
  '4s': number;
  '6s': number;
  balls: number;
  runs: number;
  matchInfoId: string;
}

export interface IBowlerRecentGames {
  matchInfoId: string;
  date: string;
  battingTeam: string;
  bowlingTeam: string;
  '0s': number;
  '4s': number;
  '6s': number;
  caught: number;
  bowled: number;
  lbw: number;
  extras: number;
  overs: number;
  runsConceded: number;
  totalWicketTaken: number;
}
export interface IDismissalsBarChartData {
  [key: string]: number;
}

export interface IBallData {
  title: string;
  stats: string[];
};

export interface IStatTileItem {
  title: string;
  subtext: string;
}

export interface IOutcomeDistributionItem {
  title: string;
  subtext: string;
}

export interface IVenueProfile {
  name: string;
  innings: number;
}

export interface IVenueInnings {
  title: string;
  subtext: string;
}


export interface IVenueRecentGames {
  matchInfoId: string;
  date: string;
  match: string;
  inningOneRuns: number;
  inningOneWickets: number;
  inningTwoRuns: number;
  inningTwoWickets: number;
  winner: string;
  bowled: number;
  caught: number;
  '0s': string;
  '4s': string;
  '6s': string;
  methodUsed: string;
  lbw: number;
}

export interface IBatsmanStatsData {
  playerName: string;
  innings: number;
  rpi: number;
  median: number;
  strikeRate: number;
  sixHitInAvgMatches: number;
  runDistribution: IRunDistribution;
  scoringDistribution: IScoringDistribution;
  recentGames: IBatsmanRecentGames[];
  dismissals: IDismissalsBarChartData;
  ballByBallData: IBallData[];
  overs_phase: IStatTileItem[];
  battingHandStats: IStatTileItem[];
  bowlingTypeStats: IStatTileItem[];
}

export interface IBowlerStatsData {
  playerName: string;
  innings: number;
  avg: number;
  strikeRate: number;
  matchWhichHasLeastWickets: number;
  dismissals: IDismissalsBarChartData;
  deliveryOutcomes: IBallData[];
  outcomeDistribution: IOutcomeDistributionItem[];
  overs_phase: IStatTileItem[];
  recentGames: IBowlerRecentGames[];
  bowlingTypeStats: IStatTileItem[];
  totalWicketTaken: number;
}

export interface IVenueStatsData {
  _id: string | null;
  venues: IVenueProfile[];
  innings: IVenueInnings[];
  dismissals: IDismissalsBarChartData;
  overs_phase: IStatTileItem[];
  battingHandStats: IStatTileItem[];
  bowlingTypeStats: IStatTileItem[];
  recentGames: IVenueRecentGames[];
  runDistribution: IRunDistribution;
}


export interface IVenueRunDistribution {
  title: string;
  subtext: string;
}

export interface ITableReportDetails {
  tableBody: ITableRow[];
  tableHeader: ITableHeader[];
}
export interface IFilterStats {
  [key: string]: number | string;
  filterName: string;
  fourAvg: string;
  fourPercentage: number;
  fours: number;
  matchCount: number;
  sixAvg: string;
  sixPercentage: number;
  sixes: number;
}

export interface IFilterData {
  stats: IFilterStats[];
  tableHeader: ITableHeader[];
}

export interface ITeamPerformanceData {
  matches: ITeamPerformanceMatch[];
  tableHeader: (string | number)[];
  filterData: IFilterData
}

export interface ITeamPerformanceMatch {
  _id: string;
  start_date: string;
  tournamentId: string;
  tournament: {
    _id: string;
    event: string;
    matchFormat: string;
    type: string;
  };
  teams: ITeamStats[];
}

export interface ITeamStats {
  team: { _id: string; name: string };
  innings: number;
  stats: Record<string, number | string>;
}

export type TReportDetails = IBatsmanStatsData | IBowlerStatsData | IVenueStatsData | ITableReportDetails | ITeamPerformanceData;

export interface IGetReportByIdResponse {
  report: {
    name: string;
    details: TReportDetails;
    filters: IReportFilter[];
  };
  totalData: number;
}

export interface IOversGroupedStat {
  items: IStatTileItem[];
};

export interface IGetReportFiltersResponse {
  report: {
    name: string;
    filters: IReportFilter[];
  }
}