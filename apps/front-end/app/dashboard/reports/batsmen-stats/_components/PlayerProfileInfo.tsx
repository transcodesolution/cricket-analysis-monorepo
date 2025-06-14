import { Stack, Text, Title, Group } from '@mantine/core';
import { TBatsmanProfileInfoData } from './BatsmanStatsReport';

export const PlayerProfileInfo = ({
  playerName,
  innings,
  rpi,
  median,
  strikeRate,
  sixHitInAvgMatches,
}: TBatsmanProfileInfoData) => {
  return (
    <Stack align="center" gap='0'>
      <Title order={2}>{playerName}</Title>
      <Text size="lg">
        Inns: <Text span fw={600}>{innings}</Text>
      </Text>
      <Group>
        <Text size="md">
          RPI: <Text span fw={600}>{rpi}</Text>
        </Text>
        <Text size="md">
          Median: <Text span fw={600}>{median}</Text>
        </Text>
      </Group>
      <Text size="xl" fw={600}>
        {strikeRate} <Text span size="sm">SR</Text>
      </Text>
      <Text size="sm">
        Hits a 6 in <Text span fw={600}>{sixHitInAvgMatches}%</Text> of matches
      </Text>
    </Stack>
  );
};