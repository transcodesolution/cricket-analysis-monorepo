import { DataTableColumn } from 'mantine-datatable';
import { Flex, Text } from '@mantine/core';
import { ITeamPerformanceMatch, ITableHeader, ITeamStats } from '@/libs/types-api/src';

export const teamPerformanceColumns = (
  tableHeader: ITableHeader[]
): DataTableColumn<ITeamPerformanceMatch>[] => {
  return [
    {
      accessor: tableHeader?.[0]?.value,
      title: tableHeader?.[0]?.label ?? 'Date',
      width: 70,
      render: ({ start_date }) =>
        start_date ? new Date(start_date).toLocaleDateString('en-IN') : '-',
    },
    {
      accessor: tableHeader?.[1]?.value,
      title: tableHeader?.[1]?.label ?? 'Competition',
      width: 100,
      render: ({ tournament }) => tournament ?? '-',
      ellipsis: true,
    },
    ...tableHeader.slice(2).map((header) => ({
      accessor: header.value as keyof ITeamPerformanceMatch,
      title: header.label,
      ellipsis: true,
      sortable: false,
      width: 65,
      render: ({ teams }: ITeamPerformanceMatch) => (
        <Flex direction="column" gap={4}>
          {teams.map((team: ITeamStats, i: number) => (
            <Text key={i} lineClamp={1} size='sm'>
              {team[header.value as keyof ITeamStats] ?? '-'}
            </Text>
          ))}
        </Flex>
      ),
    })),
  ];
};
