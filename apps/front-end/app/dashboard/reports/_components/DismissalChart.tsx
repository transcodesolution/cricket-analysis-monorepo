import { BarChart } from '@mantine/charts';
import { Paper } from '@mantine/core';
import React from 'react';
import { getColorByValue } from '@/libs/utils/ui-helper';
import { IDismissalsChart } from '@/libs/types-api/src';
import { LabelProps } from 'recharts';

export default function DismissalChart({ dismissalData }: { dismissalData: IDismissalsChart }) {
  const chartData = Object.entries(dismissalData)
    .map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const renderLabel = (props: LabelProps) => {
    const {
      value,
      x,
      y,
      width,
      height,
    } = props;

    const numericValue =
      typeof value === 'number' ? value :
        typeof value === 'string' ? parseFloat(value) :
          0;

    const numX = typeof x === 'number' ? x : parseFloat(x ?? '0');
    const numY = typeof y === 'number' ? y : parseFloat(y ?? '0');
    const numWidth = typeof width === 'number' ? width : parseFloat(width ?? '0');
    const numHeight = typeof height === 'number' ? height : parseFloat(height ?? '0');

    const isWide = numericValue >= 15;

    return (
      <g transform={`translate(${isWide ? numX + numWidth / 2 : numX + 6}, ${numY + numHeight / 2})`}>
        <text
          fontSize={16}
          fill={isWide ? 'white' : 'black'}
          textAnchor={isWide ? 'middle' : 'start'}
          dominantBaseline="central"
          fontWeight={600}
          y={-8}
        >
          {`${numericValue}%`}
        </text>
      </g>
    );
  };

  return (
    <React.Fragment>
      <Paper
        p="xs"
        bg="#3a4651"
        my="sm"
        styles={{
          root: {
            textAlign: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: 18,
            borderBottom: '1px solid #bfc9d1',
            borderRadius: 0,
          },
        }}
      >
        Method of Dismissal
      </Paper>
      <Paper>
        <BarChart
          h={320}
          data={chartData}
          dataKey="label"
          series={[{
            name: 'value',
            color: '#2196f3',
            label: 'Dismissals (%)',
          }]}
          gridAxis="y"
          barProps={{ radius: 0 }}
          orientation="vertical"
          valueFormatter={(v) => `${v}%`}
          valueLabelProps={{
            position: 'inside',
            content: renderLabel,
          }}
          withBarValueLabel
          tickLine="none"
          withTooltip={false}
          withXAxis={false}
          withYAxis={false}
          getBarColor={(value: number) => getColorByValue(value)}
          barChartProps={{ barCategoryGap: 0 }}
        />
      </Paper>
    </React.Fragment>
  );
}
