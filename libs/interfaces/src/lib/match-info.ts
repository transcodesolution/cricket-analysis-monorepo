import { MatchStatus, TossResult, WinnerTeamDecision, Brand, Color, BallType } from "@cricket-analysis-monorepo/constants";

export interface IMatchInfo {
  name: string;
  start_date: Date;
  venue: string;
  end_date: Date;
  referee: string;
  method: string;
  umpire: {
    fourthUmpire: string;
    onFieldBowlerEndUmpire: string;
    onFieldLegUmpire: string;
    thirdUmpire: string;
  };
  toss: {
    tossResult: TossResult;
    winnerTeam: string;
    winnerTeamDecision: WinnerTeamDecision;
  };
  match_number: number;
  match_id: string;
  summary: string;
  balls_per_over: number;
  tournamentId: string;
  ball: {
    brand: Brand;
    color: Color;
    type: BallType;
  };
  team1: {
    impactPlayerIn: string;
    impactPlayerOut: string;
    playingEleven: string[];
    substitutePlayers: string[];
    team: string;
  };
  team2: {
    impactPlayerIn: string;
    impactPlayerOut: string;
    playingEleven: string[];
    substitutePlayers: string[];
    team: string;
  };
  result: {
    playerOfMatch: string;
    status: MatchStatus;
    winBy: number;
    winningTeam: string;
  };
}