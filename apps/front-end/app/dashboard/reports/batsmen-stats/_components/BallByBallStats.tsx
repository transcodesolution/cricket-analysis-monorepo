import { IBallData } from '@/libs/types-api/src';
import { Paper, Text, Flex } from '@mantine/core';

interface IBallByBallStatsGrid {
  data: IBallData[];
};

export const BallByBallStats = ({ data }: IBallByBallStatsGrid) => {
  const bgColors = ['#0074c1', '#008ee6', '#7ec6f7', '#b3e0ff'];
  const textColors = ['#fff', '#fff', '#222', '#222'];

  return (
    data.map((item, idx) => (
      <Paper
        key={idx}
        radius={0}
        mih={73}
        styles={{
          root: {
            background: bgColors[idx % bgColors.length],
            color: textColors[idx % textColors.length],
            flex: '1 1 0',
            border: '1px solid #222',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
          }
        }}
      >
        <Text fw={600} fz={18}>
          {item.title}
        </Text>
        {[0, 2].map(rowIndex => (
          <Flex key={rowIndex} gap="xs" justify="center" >
            {item.stats.slice(rowIndex, rowIndex + 2).map((s, i) => (
              <Text
                key={i}
                fz={14}
                fw={rowIndex === 0 && i === 0 ? 700 : 400}
              >
                {s}
              </Text>
            ))}
          </Flex>
        ))}
      </Paper>
    ))
  );
};
