import { BarChart } from '@mantine/charts';
import { Paper } from '@mantine/core';
import React from 'react';
import { IDismissalsBarChartData } from '@/libs/types-api/src';
import { LabelProps } from 'recharts';

export const DismissalsBarChart = ({ dismissalData }: { dismissalData: IDismissalsBarChartData }) => {
  const chartData = Object.entries(dismissalData)
    .map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .map((item, idx) => ({
      ...item,
      color: `var(--mantine-color-richBlue-${Math.max(3, 7 - idx)})`,
    }));

  const renderLabel = (props: LabelProps & { index?: number }) => {
    {
      const { value, x, y, width, height, index } = props;
      if (value === undefined || value === null || x === undefined || y === undefined || width === undefined || height === undefined || index === undefined) {
        return null;
      }
      const item = chartData[index];
      if (!item) return null;

      const label = item.label;
      const val = `${value}%`;
      const isWide = parseFloat(String(value)) >= 15;

      const textColor = isWide ? 'white' : 'black';
      const textAnchor = isWide ? 'middle' : 'start';
      const textX = isWide ? parseFloat(String(x)) + parseFloat(String(width)) / 2 : parseFloat(String(x)) + 6;

      return (
        <g transform={`translate(${textX}, ${parseFloat(String(y)) + parseFloat(String(height)) / 2})`}>
          <text
            fontSize={16}
            fill={textColor}
            textAnchor={textAnchor}
            dominantBaseline="central"
            fontWeight={600}
            y={-8}
          >
            {label}
          </text>
          <text
            fontSize={12}
            fill={textColor}
            textAnchor={textAnchor}
            dominantBaseline="central"
            y={10}
          >
            {val}
          </text>
        </g>
      );
    }
  }

  return (
    <React.Fragment>
      <Paper
        p="xs"
        bg="var(--mantine-color-gray-9)"
        my="sm"
        styles={{
          root: {
            textAlign: 'center',
            color: 'white',
            fontWeight: 600,
            fontSize: 18,
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
            label: 'Dismissals (%)',
          }]}
          gridAxis="y"
          barProps={{ radius: 0 }}
          orientation="vertical"
          valueFormatter={(v) => `${v}%`}
          valueLabelProps={{
            position: 'inside',
            content: renderLabel
          }}
          withBarValueLabel
          tickLine='none'
          withTooltip={false}
          withXAxis={false}
          withYAxis={false}
          getBarColor={(value) => {
            const match = chartData.find((item) => item.value === value);
            return match?.color ?? 'var(--mantine-color-blue-3)';
          }}
          barChartProps={{ barCategoryGap: 0, }}
        />
      </Paper>
    </React.Fragment>
  );
}
