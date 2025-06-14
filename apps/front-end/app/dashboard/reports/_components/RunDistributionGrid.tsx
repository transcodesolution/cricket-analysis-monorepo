import { IRunDistribution } from '@/libs/types-api/src';
import { getFormattedStatValue } from '@/libs/utils/ui-helper';
import { Grid, Paper, Text } from '@mantine/core';
import React from 'react';

interface IRunDistributionGridData {
  title?: string;
  runDistData: IRunDistribution;
};

export const RunDistributionGrid = ({ runDistData, title }: IRunDistributionGridData) => {
  const bgColors = ['var(--mantine-color-richBlue-7)', 'var(--mantine-color-richBlue-6)', 'var(--mantine-color-richBlue-5)', 'var(--mantine-color-richBlue-4)'];
  const textColors = ['white', 'white', 'black', 'black'];

  const runDistEntries = Object.entries(runDistData);

  return (
    <React.Fragment>
      {title && (
        <Paper
          p="xs"
          radius={0}
          styles={{
            root: {
              background: 'var(--mantine-color-gray-9)',
              color: 'white',
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
                  border: '1px solid black',
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
              <Text fz={15}><b>{getFormattedStatValue(stats?.perMatch)}</b> per match</Text>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </React.Fragment>
  );
};
