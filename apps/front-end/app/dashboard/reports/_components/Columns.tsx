import { IRecentGame } from "@/libs/types-api/src";
import { getScoreColor } from "@/libs/utils/ui-helper";
import { DataTableColumn } from "mantine-datatable";
import { Text } from '@mantine/core';

export const getColumns = (): DataTableColumn<IRecentGame>[] => [
  {
    accessor: 'date',
    title: 'Date',
    width: 90,
    render: ({ date }) => date ? new Date(date).toLocaleDateString('en-IN') : '-',
    textAlign: 'center'
  },
  {
    accessor: 'battingTeam',
    title: 'Batting Team',
    width: 100,
    ellipsis: true
  },
  {
    accessor: 'bowlingTeam',
    title: 'Bowling Team',
    width: 100,
    ellipsis: true
  },
  {
    accessor: 'dismissal',
    title: 'Dismissal',
    width: 90,
    render: ({ dismissal }) => dismissal || '-',
    textAlign: 'center'
  },
  {
    accessor: '0%',
    title: '0%',
    width: 60,
    render: (row) => row['0s'] ?? 0,
    textAlign: 'center'
  },
  {
    accessor: '4%',
    title: '4%',
    width: 60,
    render: (row) => row['4s'] ?? 0,
    textAlign: 'center'
  },
  {
    accessor: '6%',
    title: '6%',
    width: 60,
    render: (row) => row['6s'] ?? 0,
    textAlign: 'center'
  },
  {
    accessor: 'score',
    title: '',
    width: 70,
    textAlign: 'center',
    render: (row) => (
      <Text
        fz={13}
        fw={600}
        style={{
          backgroundColor: getScoreColor(row.runs),
          color: '#fff',
          borderRadius: 4,
          padding: '2px 8px',
          textAlign: 'center',
          display: 'inline-block',
          minWidth: 40,
        }}
      >
        {row.runs} ({row.balls})
      </Text>
    ),
  },
];