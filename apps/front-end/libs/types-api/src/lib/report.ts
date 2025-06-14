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
  perMatch: number;
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

export interface IOversPhaseItem {
  title: string;
  subtext: string;
}

export interface IOutcomeDistributionItem {
  title: string;
  subtext: string;
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
  overs_phase: IOversPhaseItem[];
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
  overs_phase: IOversPhaseItem[];
  recentGames: IBowlerRecentGames[];
}

export interface ITableReportDetails {
  tableBody: ITableRow[];
  tableHeader: ITableHeader[];
}

export type IReportDetails = IBatsmanStatsData | IBowlerStatsData | ITableReportDetails;

export interface IGetReportByIdResponse {
  report: {
    name: string;
    details: IReportDetails;
    filters: IReportFilter[];
  };
  totalData: number;
}

export interface IOversGroupedStat {
  items: IOversPhaseItem[];
};
