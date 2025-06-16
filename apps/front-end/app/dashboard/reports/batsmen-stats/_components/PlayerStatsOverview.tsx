import { Grid, Paper, Stack } from '@mantine/core';
import { GroupedStatsGrid } from '../../_components/GroupedStatsGrid';
import { RunDistributionGrid } from '../../_components/RunDistributionGrid';
import { PlayerProfileInfo } from './PlayerProfileInfo';
import { BallByBallStats } from './BallByBallStats';
import { IBallData, IOversGroupedStat, IRunDistribution } from '@/libs/types-api/src';
import { TBatsmanProfileInfoData } from './BatsmanStatsReport';

interface IPlayerStatsOverviewData {
  profileInfo: TBatsmanProfileInfoData;
  runDistData: IRunDistribution;
  ballByBallData: IBallData[]
  sidePanelStats: IOversGroupedStat[];
};

export const PlayerStatsOverview = ({
  profileInfo,
  runDistData,
  ballByBallData,
  sidePanelStats,
}: IPlayerStatsOverviewData) => {

  return (
    <Grid gutter="lg" mt="md" align="stretch">
      {/* Left panel */}
      <Grid.Col span={{ base: 9, md: 4.5 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Stack styles={{ root: { flexGrow: 1, justifyContent: 'space-between' } }} gap={0}>
          <Paper p="sm" radius="md" h='100%' styles={{ root: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
            <PlayerProfileInfo {...profileInfo} />
          </Paper>
          <RunDistributionGrid title="Run Distribution" runDistData={runDistData} />
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 3, md: 1.5 }}>
        <BallByBallStats data={ballByBallData} />
      </Grid.Col>

      {/* Right panel */}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <GroupedStatsGrid data={sidePanelStats} />
      </Grid.Col>
    </Grid>
  );
};
