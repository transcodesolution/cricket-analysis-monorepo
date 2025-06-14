import { IVenueRecentGames } from "@/libs/types-api/src";
import { DataTableColumn } from "mantine-datatable";
import { Badge, Group, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export const venueColumns: DataTableColumn<IVenueRecentGames>[] = [
  {
    accessor: 'date',
    title: 'Date',
    width: 90,
    render: ({ date }) =>
      date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-',
    textAlign: 'center'
  },
  {
    accessor: 'match',
    title: 'Match',
    width: 200,
    ellipsis: true,
  },
  {
    accessor: 'inningOneRuns',
    title: '1st Inns',
    width: 80,
    render: ({ inningOneRuns, inningOneWickets }) => `${inningOneRuns}/${inningOneWickets}`,
    textAlign: 'center',
  },
  {
    accessor: 'inningTwoRuns',
    title: '2nd Inns',
    width: 80,
    render: ({ inningTwoRuns, inningTwoWickets }) => `${inningTwoRuns}/${inningTwoWickets}`,
    textAlign: 'center',
  },
  {
    accessor: '0s',
    title: '0%',
    width: 60,
    textAlign: 'center',
  },
  {
    accessor: '4s',
    title: '4%',
    width: 60,
    textAlign: 'center',
  },
  {
    accessor: '6s',
    title: '6%',
    width: 60,
    textAlign: 'center',
  },
  {
    accessor: 'caught',
    title: 'Caught',
    width: 70,
    textAlign: 'center',
  },
  {
    accessor: 'bowled',
    title: 'Bowled',
    width: 70,
    textAlign: 'center',
  },
  {
    accessor: 'lbw',
    title: 'LBW',
    width: 50,
    textAlign: 'center',
    render: (r) => r.lbw ?? 0,
  },
  {
    accessor: 'winner',
    title: 'Result',
    width: 100,
    textAlign: 'center',
    render: ({ winner, methodUsed }) => {
      return (
        <Text
          fw={600}
          fz={13}
          style={{
            padding: '2px 6px',
            borderRadius: 4,
            background: methodUsed ? 'var(--mantine-color-orange-6)' : 'var(--mantine-color-richBlue-6)',
            color: 'white',
            display: 'inline-block',
            minWidth: 60,
          }}
        >
          {methodUsed ? winner + 'i' : winner}
        </Text>
      );
    },
  }
];
