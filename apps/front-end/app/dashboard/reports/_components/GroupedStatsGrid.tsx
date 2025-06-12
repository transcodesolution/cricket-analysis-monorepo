import { IOversGroupedStat } from '@/libs/types-api/src';
import { Grid, Paper, Stack, Text, Title } from '@mantine/core';

interface IGroupedStatsGridData {
  data: IOversGroupedStat[];
};

export const GroupedStatsGrid = ({ data }: IGroupedStatsGridData) => {

  const getBoxStyle = (index: number) => {
    const isEven = index % 2 === 0;
    return {
      backgroundColor: isEven ? '#E87722' : '#FDF3C0',
      color: isEven ? '#fff' : '#222',
    };
  };

  return (
    <Stack gap="xs">
      {data.map((group, groupIndex) => (
        <Grid key={groupIndex} gutter={4} align="stretch">
          {group.items.map((item, itemIndex) => {
            const style = getBoxStyle(itemIndex);
            return (
              <Grid.Col span={12 / group.items.length} key={itemIndex}>
                <Paper p='md' radius="md" style={style} styles={{ root: { textAlign: 'center', minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } }} >
                  <Title order={3} fw={500}>{item.title}</Title>
                  {item.subtext && (
                    <Text size="md" style={{ whiteSpace: 'pre-line' }}>
                      {item.subtext}
                    </Text>
                  )}
                </Paper>
              </Grid.Col>
            );
          })}
        </Grid>
      ))}
    </Stack>
  );
};