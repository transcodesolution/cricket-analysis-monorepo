export interface IMatchAnalytics {
  netRunRate: number;
  totalBallFaced: number;
  totalRuns: string;
  matchId: string;
  economyRate: number;
  teamTwo: ITeamAnalytics;
  teamOne: ITeamAnalytics;
}

export interface ITeamAnalytics {
  fallOfWickets: IFallOfWicket[];
  players: IPlayerAnalytics[];
  teamId: string;
  yetToBatPlayerIds: string[];
}

export interface IFallOfWicket {
  ballNumber: number;
  playerId: string;
  runsScore: string;
}

export interface IPlayerAnalytics {
  asBatsmen: IBatsmanStats;
  asBowler: IBowlerStats;
  playerId: string;
}

export interface IBatsmanStats {
  overPlayed: number;
  totalFoursHit: number;
  totalRuns: string;
  totalSixHit: number;
}

export interface IBowlerStats {
  oversBowl: number;
  runsConceded: number;
  totalNoBall: number;
  totalWicketTaken: number;
  totalWide: number;
}