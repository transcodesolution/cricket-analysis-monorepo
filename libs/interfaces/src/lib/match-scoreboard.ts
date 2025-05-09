export interface Ball {
  ball: number;
  bowler: string;
  non_stiker: {
    player: string;
  };
  runs_off_bat: number;
  striker: {
    player: string;
    position: string;
    shot: {
      name: string;
      type: string;
    };
  };
  substitute: {
    player: string;
    reasonType: string;
    replacedPlayer: string;
  };
  wicket: {
    dismissedPlayer: string;
    takenBy: string[];
    type: string;
  };
  winningChance: number;
}

export interface MatchScoreboard {
  over: number;
  matchId: string;
  innings: number;
  match_id: string;
  sheet_match_id: string;
  extras: {
    byes: number;
    fours: number;
    legbyes: number;
    noballs: number;
    penalty: number;
    sixes: number;
    total: number;
    wides: number;
  };
  balls: Ball[];
}