export interface IMatchAnalytics {
  totalBallFaced: number;
  totalRuns: number;
  matchId: string;
  teamOne: ITeamAnalytics;
  teamTwo: ITeamAnalytics;
}

export interface ITeamAnalytics {
  netRunRate?: number;
  fallOfWickets?: IFallOfWicket[];
  playerStats?: IPlayerAnalytics[];
  team?: string;
  yetToBatPlayers?: string[];
  summary?: IMatchSummary;
}

export interface IFallOfWicket {
  over?: number;
  ballNumber?: number;
  player?: string;
  bowler?: string;
  runsScore?: number;
}

export interface IPlayerAnalytics {
  batting?: IBatsmanStats;
  bowling?: IBowlerStats;
  player?: string;
}

export interface IBatsmanStats {
  overPlayedIn?: {
    over: number;
    runs: number;
    totalSixHit: number;
    ballsFaced: number;
    0: number;
    1: number;
  }[];
  totalFoursHit?: number;
  runs?: number;
  totalSixHit?: number;
  ballsFaced?: number;
  0?: number;
  1?: number;
  2?: number;
  3?: number;
  4?: number;
  5?: number;
  6?: number;
  strikeRate?: number;
  timeSpend?: number;
  shot?: {
    over?: number;
    bowler?: string;
    angle?: number;
    distance?: number;
    runs?: number;
    shotType?: string;
    result?: string;
  };
}

export interface IBowlerStats {
  overs?: number;
  ballsBowled?: number;
  runsConceded?: number;
  totalNoBall?: number;
  totalWicketTaken?: number;
  totalWide?: number;
  totalFourConceded?: number;
  totalSixConceded?: number;
  totalMaidenOvers?: number;
  totalDotBalls?: number;
  economyRate?: number;
  phases?: {
    powerPlay?: number;
    middle?: number;
    Death?: number;
  }[];
}

export interface IMatchSummary {
  topScorer?: string;
  totalWicketTaken?: number;
  topWicketTaken?: string;
  margin?: number;
}