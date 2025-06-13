import { DataTableColumn } from 'mantine-datatable';
import { Text } from '@mantine/core';
import { IBowlerRecentGame } from '@/libs/types-api/src';
import { formatToFixed1OrZero, getScoreColor } from '@/libs/utils/ui-helper';

export const bowlerColumns: DataTableColumn<IBowlerRecentGame>[] = [
  {
    accessor: 'date',
    title: 'Date',
    width: 90,
    render: ({ date }) =>
      date ? new Date(date).toLocaleDateString('en-IN') : '-',
    textAlign: 'center',
  },
  { accessor: 'bowlingTeam', title: 'Bowling Team', width: 120, ellipsis: true },
  { accessor: 'battingTeam', title: 'Batting Team', width: 120, ellipsis: true },
  {
    accessor: '0%',
    title: '0%',
    width: 60,
    render: (r) => formatToFixed1OrZero(r['0s']),
    textAlign: 'center',
  },
  {
    accessor: '4%',
    title: '4%',
    width: 60,
    render: (r) => formatToFixed1OrZero(r['4s']),
    textAlign: 'center',
  },
  {
    accessor: '6%',
    title: '6%',
    width: 60,
    render: (r) => formatToFixed1OrZero(r['6s']),
    textAlign: 'center',
  },

  {
    accessor: 'caught',
    title: 'Caught',
    width: 65,
    textAlign: 'center',
    render: (r) => r.caught ?? 0,
  },
  {
    accessor: 'bowled',
    title: 'Bowled',
    width: 65,
    textAlign: 'center',
    render: (r) => r.bowled ?? 0,
  },
  {
    accessor: 'lbw',
    title: 'LBW',
    width: 55,
    textAlign: 'center',
    render: (r) => r.lbw ?? 0,
  },
  {
    accessor: 'extras',
    title: 'BExtra',
    width: 65,
    textAlign: 'center',
    render: (r) => r.extras ?? 0,
  },
  {
    accessor: 'spell',
    title: '',
    width: 80,
    textAlign: 'center',
    render: (row) => (
      <Text
        fw={600}
        fz={13}
        style={{
          padding: '2px 6px',
          borderRadius: 4,
          background: getScoreColor(row.runsConceded),
          color: 'white',
          display: 'inline-block',
          minWidth: 60,
        }}
      >
        {formatToFixed1OrZero(row.overs)}‑{row.runsConceded}‑{row.totalWicketTaken}
      </Text>
    ),
  },
];
