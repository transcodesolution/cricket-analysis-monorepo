import { MatchStatus, TossResult, WinnerTeamDecision } from "@cricket-analysis-monorepo/constants";

export interface MatchInfo {
  name: string;
  startDate: Date;
  venue: string;
  endDate: Date;
  referee: string;
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
  balls_per_over: number;
  match_id: string;
  summary: string;
  team2: {
    impactPlayerIn: string;
    impactPlayerOut: string;
    playingEleven: string[];
    substitutPlayers: string[];
    team: string;
  };
  tournamentId: string;
  ball: {
    brand: string;
    color: string;
    type: string;
  };
  team1: {
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