import { DataTable, DataTableColumn } from 'mantine-datatable';
import {
  IBatsmanRecentGames,
  IBowlerRecentGames,
} from '@/libs/types-api/src';
import { batsmanColumns } from './columns/batsmanColumns';
import { bowlerColumns } from './columns/bowlerColumns';
interface IRecentGamesTable {
  playerType: TPlayerType;
  games: IBatsmanRecentGames[] | IBowlerRecentGames[];
}

type TPlayerType = 'batsman' | 'bowler';
type TPlayerRecord = TPlayerType extends 'batsman' ? IBatsmanRecentGames : IBowlerRecentGames;

export const RecentGamesTable = ({ playerType, games }: IRecentGamesTable) => {
  const columns = playerType === 'batsman' ? batsmanColumns : bowlerColumns


  const playerRecords = games as TPlayerRecord[];

  return (
    <DataTable<TPlayerRecord>
      records={playerRecords}
      columns={columns as DataTableColumn<TPlayerRecord>[]}
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
