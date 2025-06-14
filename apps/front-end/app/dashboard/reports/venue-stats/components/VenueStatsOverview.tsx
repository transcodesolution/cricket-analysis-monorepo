import { Grid, Paper, } from '@mantine/core';
import { GroupedStatsGrid } from '../../_components/GroupedStatsGrid';
import { IOversGroupedStat, IVenueProfile } from '@/libs/types-api/src';
import { VenueProfileInfo } from './VenueProfileInfo';

interface IVenueStatsOverviewData {
  venues: IVenueProfile[];
  inningsStats: IOversGroupedStat[];
  rightPanelStatsData: IOversGroupedStat[];
};

export const VenueStatsOverview = ({
  venues,
  inningsStats,
  rightPanelStatsData,
}: IVenueStatsOverviewData) => {
  console.log('venues', venues);

  return (
    <Grid gutter="lg" mt="md">
      {/* Left panel */}
      <Grid.Col span={{ base: 12, md: 6 }} style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
        <Paper p="sm" radius="md" mb="lg">
          <VenueProfileInfo VenueProfile={venues} />
        </Paper>
        <GroupedStatsGrid data={inningsStats} />
      </Grid.Col>
      {/* Right panel */}
      <Grid.Col span={{ base: 12, md: 6 }} >
        <GroupedStatsGrid data={rightPanelStatsData} />
      </Grid.Col>
    </Grid>
  );
};
