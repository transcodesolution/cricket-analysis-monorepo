'use client';
import { Paper, Grid } from '@mantine/core';
import DismissalChart from './DismissalChart';
import { IDismissalsChart, IBatsmanRecentGame, IBowlerRecentGame } from '@/libs/types-api/src';
import RecentGamesTable from './RecentGamesTable';

interface IDismissalAndRecentGames {
  dismissals: IDismissalsChart;
  games: IBatsmanRecentGame[] | IBowlerRecentGame[];
  playerType?: 'batsman' | 'bowler';
};

export const DismissalAndRecentGames = ({ dismissals, games, playerType = 'batsman' }: IDismissalAndRecentGames) => {

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
        <RecentGamesTable games={games} playerType={playerType} />
      </Grid.Col>
    </Grid >
  )
};