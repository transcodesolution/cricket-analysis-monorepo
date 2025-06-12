import { IRunDistribution } from '@/libs/types-api/src';
import { Grid, Paper, Text } from '@mantine/core';

interface IRunDistributionGridData {
  title?: string;
  runDistData: IRunDistribution;
};

export const RunDistributionGrid = ({ runDistData, title }: IRunDistributionGridData) => {
  const bgColors = ['#0074c1', '#008ee6', '#7ec6f7', '#b3e0ff'];
  const textColors = ['#fff', '#fff', '#222', '#222'];

  const runDistEntries = Object.entries(runDistData);

  return (
    <div>
      {title && (
        <Paper
          p="xs"
          radius={0}
          styles={{
            root: {
              background: '#3a4651',
              color: '#fff',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: 18,
            },
          }}
          my="sm"
        >
          {title}
        </Paper>
      )}
      <Grid gutter={0} m={0}>
        {runDistEntries.map(([runType, stats], idx) => (
          <Grid.Col span={12 / runDistEntries.length} key={runType} p={0}>
            <Paper
              p="xs"
              radius={0}
              styles={{
                root: {
                  background: bgColors[idx % bgColors.length],
                  color: textColors[idx % textColors.length],
                  height: '100%',
                  border: '1px solid #222',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              }}
            >
              <Text fw={700} fz={22} mb={2}>
                {runType}
              </Text>
              <Text fz={15} mb={1}><b>{stats?.balls ?? 0}%</b> of balls</Text>
              <Text fz={15} mb={1}><b>{stats?.runs ?? 0}% </b> of runs</Text>
              <Text fz={15}><b>{(stats?.runs ?? 0).toFixed(1)}</b> per match</Text>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};
