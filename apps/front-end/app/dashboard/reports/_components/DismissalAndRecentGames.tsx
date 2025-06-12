'use client';
import { Paper, Grid } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import DismissalChart from './DismissalChart';
import { IDismissalsChart, IRecentGame } from '@/libs/types-api/src';
import { getColumns } from './Columns';

interface IDismissalAndRecentGames {
  dismissals: IDismissalsChart;
  games: IRecentGame[];
};

export const DismissalAndRecentGames = ({ dismissals, games }: IDismissalAndRecentGames) => {

  const columns = getColumns();

  return (
    <Grid gutter={8} align="stretch" style={{ width: '100%' }}>
      <Grid.Col span={{ base: 12, md: 3 }}>
        <DismissalChart dismissalData={dismissals} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 9 }}>
        <Paper
          p="xs"
          bg='var(--mantine-color-gray-9)'
          my='sm'
          styles={{
            root: {
              textAlign: 'center',
              color: 'white',
              fontWeight: 600,
              fontSize: 18,
              borderBottom: '1px solid var(--mantine-color-gray-3)',
              borderRadius: 0,
            }
          }}
        >
          20 Most Recent Games
        </Paper>
        <DataTable
          idAccessor="matchInfoId"
          withTableBorder={false}
          minHeight={300}
          height={400}
          striped
          rowStyle={(_, index) => ({
            backgroundColor: index % 2 === 0 ? 'white' : 'var(--mantine-color-lightBlue-1)',
          })}
          records={games}
          columns={columns}
        />
      </Grid.Col>
    </Grid >
  )
};