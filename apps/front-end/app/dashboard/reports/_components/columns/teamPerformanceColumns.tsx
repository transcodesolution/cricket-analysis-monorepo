import { DataTableColumn } from 'mantine-datatable';
import { Flex, Text } from '@mantine/core';
import { ITeamPerformanceMatch, ITableHeader, ITeamStats } from '@/libs/types-api/src';
import { IconCaretDownFilled, IconCaretRightFilled } from '@tabler/icons-react';

export const teamPerformanceColumns = (
  tableHeader: ITableHeader[],
  expandedHeaders: Set<string>,
  toggleHeader: (accessor: string) => void
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
      title: (
        <Flex align="center" gap='sm' style={{ cursor: 'pointer' }} onClick={() => toggleHeader(tableHeader?.[1]?.value)}>
          <Text fw={600}>{tableHeader?.[1]?.label ?? 'Competition'}</Text>
          {expandedHeaders.has(tableHeader?.[1]?.value) ? <IconCaretDownFilled size={16} /> : <IconCaretRightFilled size={16} />}
        </Flex>
      ),
      width: expandedHeaders.has(tableHeader?.[1]?.value) ? 200 : 140,
      render: ({ tournament }) => (
        <Text size="sm" lineClamp={expandedHeaders.has(tableHeader?.[1]?.value) ? 3 : 1}>
          {tournament ?? '-'}
        </Text>
      ),
    },
    {
      accessor: 'teams',
      title: (
        <Flex align="center" gap='sm' style={{ cursor: 'pointer' }} onClick={() => toggleHeader(tableHeader?.[2]?.value)}>
          <Text fw={600}>{tableHeader?.[2]?.label ?? 'Team'}</Text>
          {expandedHeaders.has(tableHeader?.[2]?.value) ? <IconCaretDownFilled size={16} /> : <IconCaretRightFilled size={16} />}
        </Flex>
      ),
      width: expandedHeaders.has(tableHeader?.[2]?.value) ? 200 : 100,
      render: ({ teams }: ITeamPerformanceMatch) => (
        <Flex direction="column" gap={4}>
          {teams.map((team: ITeamStats, i: number) => (
            <Text
              key={i}
              size="sm"
              lineClamp={expandedHeaders.has(tableHeader?.[2]?.value) ? 3 : 1}
            >
              {team[tableHeader[2].value as keyof ITeamStats] ?? '-'}
            </Text>
          ))}
        </Flex>
      ),
    },
    ...tableHeader.slice(3).map((header) => ({
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
