import { batsmanColumns } from './batsmanColumns';
import { bowlerColumns } from './bowlerColumns';

export type PlayerType = 'batsman' | 'bowler';

export const getColumns = (playerType: PlayerType) => {
  return playerType === 'batsman' ? batsmanColumns : bowlerColumns;
};
