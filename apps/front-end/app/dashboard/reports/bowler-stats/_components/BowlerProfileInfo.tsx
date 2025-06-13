import { Group, Stack, Text, Title } from '@mantine/core';
import { BowlerProfileInfoData } from './BowlerStatsReport';

export const BowlerProfileInfo = ({
  playerName,
  innings,
  avg,
  strikeRate,
  matchWhichHasLeastWickets,
}: BowlerProfileInfoData) => {

  return (
    <Stack align="center" gap="md">
      <Title order={2}>{playerName}</Title>

      <Text size="lg">
        Inns: <Text span fw={600}>{innings}</Text>
      </Text>

      <Group gap="xs">
        <Text size="md" fw={600}>
          {avg} <Text span size="sm">Ave</Text>
        </Text>
        <Text size="md" fw={600}>
          {strikeRate} <Text span size="sm">SR</Text>
        </Text>
      </Group>

      <Text size="sm">
        Gets a wkt in <Text span fw={600}>{matchWhichHasLeastWickets}%</Text> of matches
      </Text>
    </Stack>
  );
};
