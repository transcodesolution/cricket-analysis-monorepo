import { Grid, Paper, Text } from '@mantine/core';
import React from 'react';

export interface IStatDistributionItem {
  title: string;
  lines: string[];
}

interface IStatDistributionGrid {
  title?: string;
  data: IStatDistributionItem[];
}

const bgPalette = [
  'var(--mantine-color-richBlue-7)',
  'var(--mantine-color-richBlue-6)',
  'var(--mantine-color-richBlue-5)',
  'var(--mantine-color-richBlue-4)',
];
const fgPalette = ['white', 'white', 'black', 'black'];

export const StatDistributionGrid = ({
  title,
  data,
}: IStatDistributionGrid) => {
  return (
    <>
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
        {data.map((item, idx) => (
          <Grid.Col span={12 / data.length} key={idx} p={0}>
            <Paper
              p="xs"
              radius={0}
              style={{
                background: bgPalette[idx % bgPalette.length],
                color: fgPalette[idx % fgPalette.length],
                minHeight: 188,
                border: '1px solid black',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text fw={700} fz={18} mb={2}>
                {item.title}
              </Text>
              {item.lines.map((line, i) => (
                <Text key={i} fz={14} style={{ opacity: 0.9 }}>
                  {line}
                </Text>
              ))}
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
};
