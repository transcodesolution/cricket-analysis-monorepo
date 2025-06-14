import { Grid } from '@mantine/core';
import { IBallData, IOutcomeDistributionItem } from '@/libs/types-api/src';
import { StatDistributionGrid } from '../../_components/StatDistributionGrid';

interface IDistributionGridOverview {
  outcomeTitle: string;
  outcomeData: IOutcomeDistributionItem[];
  deliveryTitle: string;
  deliveryData: IBallData[];
}

export const DistributionGridOverview = ({
  outcomeTitle,
  outcomeData,
  deliveryTitle,
  deliveryData,
}: IDistributionGridOverview) => {
  const outcomeGridData = outcomeData.map(d => ({
    title: d.title,
    lines: d.subtext.split('\n'),
  }));

  const deliveryGridData = deliveryData.map(d => ({
    title: d.title,
    lines: d.stats,
  }));

  return (
    <Grid gutter="lg" align="stretch">
      <Grid.Col span={{ base: 12, md: 6 }} py={0}>
        <StatDistributionGrid title={outcomeTitle} data={outcomeGridData} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }} py={0}>
        <StatDistributionGrid title={deliveryTitle} data={deliveryGridData} />
      </Grid.Col>
    </Grid>
  );
};
