import { Grid, Paper, Stack } from '@mantine/core';
import { GroupedStatsGrid } from '../../_components/GroupedStatsGrid';
import { BowlerProfileInfo } from './BowlerProfileInfo';
import { TBowlerProfileInfoData } from './BowlerStatsReport';
import { IOversGroupedStat } from '@/libs/types-api/src';

interface IBowlerStatsOverview {
  profileInfo: TBowlerProfileInfoData;
  sidePanelStats: IOversGroupedStat[];
};


export const BowlerStatsOverview = ({
  profileInfo,
  sidePanelStats,
}: IBowlerStatsOverview) => {

  return (
    <Grid gutter="lg" mt="md" align="stretch">
      {/* Left panel */}
      <Grid.Col span={{ base: 12, md: 6 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Stack style={{ flexGrow: 1, justifyContent: 'space-between' }} >
          <Paper p="sm" radius="md" my='auto' h='100%' styles={{ root: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            <BowlerProfileInfo {...profileInfo} />
          </Paper>
        </Stack>
      </Grid.Col>
      {/* Right panel */}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <GroupedStatsGrid data={sidePanelStats} />
      </Grid.Col>
    </Grid>
  );
};
