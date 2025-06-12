import { IBallData } from '@/libs/types-api/src';
import { Paper, Text, Flex } from '@mantine/core';

interface IBallByBallStatsGrid {
  data: IBallData[];
};

export const BallByBallStats = ({ data }: IBallByBallStatsGrid) => {
  const bgColors = ['var(--mantine-color-richBlue-7)', 'var(--mantine-color-richBlue-6)', 'var(--mantine-color-richBlue-5)', 'var(--mantine-color-richBlue-4)'];
  const textColors = ['white', 'white', 'black', 'black'];

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
            border: '1px solid black',
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
