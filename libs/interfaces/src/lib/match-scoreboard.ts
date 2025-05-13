import { SubstituteReasonType, WicketType } from '@cricket-analysis-monorepo/constants';

export interface IBall {
  over?: number;
  ball: number;
  foursHit: number;
  sixHit: number;
  bowler: string;
  non_striker: {
    player: string;
  };
  runs_off_bat: number;
  striker: {
    player: string;
    position: string;
    shot: {
      name: string;
      type: string;
      angle: number;
      distance: number;
    };
  };
  substitute: {
    player: string;
    reasonType: SubstituteReasonType;
    replacedPlayer: string;
  };
  wicket: {
    dismissedPlayer?: string;
    takenBy?: string[];
    type?: WicketType;
  };
  winningChance: number;
  extras?: Partial<{
    byes: number;
    legbyes: number;
    noballs: number;
    penalty: number;
    total: number;
    wides: number;
    dots: number;
    fours: number;
    sixes: number;
  }>;
}

export interface IMatchScoreboard {
  over: number;
  match_id: string;
  sheet_match_id: string;
  innings: number;
  balls: IBall[];
}