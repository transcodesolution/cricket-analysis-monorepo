import { DataTable, DataTableColumn } from 'mantine-datatable';
import {
  IBatsmanRecentGames,
  IBowlerRecentGames,
} from '@/libs/types-api/src';
import { batsmanColumns } from './columns/batsmanColumns';
import { bowlerColumns } from './columns/bowlerColumns';
interface IRecentGamesTable {
  playerType: PlayerType;
  games: IBatsmanRecentGames[] | IBowlerRecentGames[];
}

type PlayerType = 'batsman' | 'bowler';
type PlayerRecord = PlayerType extends 'batsman' ? IBatsmanRecentGames : IBowlerRecentGames;

export const RecentGamesTable = ({ playerType, games }: IRecentGamesTable) => {
  const columns = playerType === 'batsman' ? batsmanColumns : bowlerColumns


  const playerRecords = games as PlayerRecord[];

  return (
    <DataTable<PlayerRecord>
      records={playerRecords}
      columns={columns as DataTableColumn<PlayerRecord>[]}
      idAccessor="matchInfoId"
      withTableBorder={false}
      striped
      minHeight={300}
      height={400}
      rowStyle={(_, index) => ({
        backgroundColor:
          index % 2 === 0 ? 'white' : 'var(--mantine-color-lightBlue-1)',
      })}
    />
  );
};

export default RecentGamesTable;
