import { DataTableColumn } from 'mantine-datatable';
import { Flex, Text } from '@mantine/core';
import { ITeamPerformanceMatch, ITeamStats } from '@/libs/types-api/src';

const getStat = (stats: ITeamStats['stats'], key: string) =>
  stats?.[key] ?? '-';

export const generateDynamicStatColumnsForTeams = (
  matches: ITeamPerformanceMatch[],
  tableHeader?: (string | number)[],
  startIndexOffset = 4
): DataTableColumn<ITeamPerformanceMatch>[] => {
  let statKeys: string[] = [];

  if (matches.length > 0) {
    // Extract actual keys from data
    const statKeySet = new Set<string>();
    matches.forEach((match) => {
      match.teams.forEach((team) => {
        Object.keys(team.stats || {}).forEach((key) => statKeySet.add(key));
      });
    });
    statKeys = Array.from(statKeySet);
  } else if (tableHeader) {
    statKeys = tableHeader.slice(startIndexOffset).map((_, i) => `col_${i}`);
  }

  return statKeys.map((statKey, index) => ({
    accessor: `stats.${statKey}`,
    title: tableHeader?.[index + startIndexOffset] ?? statKey,
    width: 100,
    render: ({ teams }) => (
      <Flex direction="column" gap={4}>
        {teams.map((team) => (
          <Text key={team.team._id} size="sm">
            {getStat(team.stats, statKey)}
          </Text>
        ))}
      </Flex>
    ),
  }));
};

export const teamPerformanceColumns = (data: ITeamPerformanceMatch[], tableHeader?: (string | number)[]): DataTableColumn<ITeamPerformanceMatch>[] => {
  return [
    {
      accessor: 'start_date',
      title: tableHeader?.[0] ?? 'Date',
      width: 100,
      render: ({ start_date }) =>
        start_date ? new Date(start_date).toLocaleDateString('en-IN') : '-',
    },
    {
      accessor: 'tournament.event',
      title: tableHeader?.[1] ?? 'Competition',
      width: 160,
      render: ({ tournament }) => tournament?.event ?? '-',
    },
    {
      accessor: 'teams',
      title: tableHeader?.[2] ?? 'Team',
      width: 250,
      render: ({ teams }) => (
        <Flex direction="column" gap={4}>
          {teams.map((team) => (
            <Text key={team.team._id} size="sm" lineClamp={1}>
              {team.team.name}
            </Text>
          ))}
        </Flex>
      ),
    }, {
      accessor: 'innings',
      title: tableHeader?.[3] ?? 'Innings',
      width: 100,
      render: ({ teams }) => (
        <Flex direction="column" gap={4}>
          {teams.map((team) => (
            <Text key={team.team._id} size="sm">
              {team.innings ?? '-'}
            </Text>
          ))}
        </Flex>
      ),
    },
    ...generateDynamicStatColumnsForTeams(data, tableHeader, 4),
  ];
};
