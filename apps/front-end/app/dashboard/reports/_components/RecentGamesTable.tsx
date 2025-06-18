import { DataTable, DataTableColumn } from 'mantine-datatable';
import {
  IBatsmanRecentGames,
  IBowlerRecentGames,
  IVenueRecentGames,
} from '@/libs/types-api/src';
import { batsmanColumns } from './columns/batsmanColumns';
import { bowlerColumns } from './columns/bowlerColumns';
import { venueColumns } from './columns/venueColumns';
interface IRecentGamesTable {
  reportFor: TPlayerType;
  recentGames: IBatsmanRecentGames[] | IBowlerRecentGames[] | IVenueRecentGames[];
}

type TPlayerType = 'batsman' | 'bowler' | 'venue';
type TPlayerRecord = TPlayerType extends 'batsman' ? IBatsmanRecentGames : TPlayerType extends 'bowler' ? IBowlerRecentGames : IVenueRecentGames;

export const RecentGamesTable = ({ reportFor, recentGames }: IRecentGamesTable) => {
  const columns = reportFor === 'batsman' ? batsmanColumns : reportFor === 'bowler' ? bowlerColumns : venueColumns;
  const playerRecords = recentGames as TPlayerRecord[];

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
