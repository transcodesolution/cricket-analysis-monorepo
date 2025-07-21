import { DataTable, DataTableColumn } from 'mantine-datatable';
import { IFilterStats, ITableHeader } from '@/libs/types-api/src';
import { useMediaQuery } from '@mantine/hooks';

interface ITeamFilterTable {
  data: IFilterStats[];
  tableHeader: ITableHeader[];
}

export const TeamFilterTable = ({ data, tableHeader, }: ITeamFilterTable) => {
  const isMobile = useMediaQuery('(max-width: 68em)');
  if (!data?.length || !tableHeader?.length) return null;

  const columns: DataTableColumn<IFilterStats>[] = tableHeader.map((header) => ({
    accessor: header.value.toString(),
    title: header.label.toString(),
    ellipsis: true
  }));

  return (
    <DataTable
      idAccessor="filterName"
      records={data}
      columns={columns}
      striped
      highlightOnHover
      verticalSpacing="xs"
      withTableBorder
      borderRadius="lg"
      withRowBorders={false}
      height={isMobile ? 'calc(100vh - 40rem)' : '100%'}
      styles={{
        header: {
          backgroundColor: 'var(--mantine-color-gray-1)',
          color: 'var(--mantine-color-gray-7)',
        },
        pagination: {
          flexDirection: 'row',
        },
      }}
    />
  );
}
