import { DataTable, DataTableColumn } from 'mantine-datatable';
import {
  IBatsmanRecentGame,
  IBowlerRecentGame,
} from '@/libs/types-api/src';
import { getColumns, PlayerType } from './columns/getColumns';

interface IRecentGamesTableData {
  playerType: PlayerType;
  games: IBatsmanRecentGame[] | IBowlerRecentGame[];
}

export const RecentGamesTable = ({ playerType, games }: IRecentGamesTableData) => {
  const columns = getColumns(playerType);

  type PlayerRecord = PlayerType extends 'batsman' ? IBatsmanRecentGame : IBowlerRecentGame;

  const playerColumns = columns as DataTableColumn<PlayerRecord>[];
  const playerRecords = games as PlayerRecord[];

  return (
    <DataTable<PlayerRecord>
      records={playerRecords}
      columns={playerColumns}
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
