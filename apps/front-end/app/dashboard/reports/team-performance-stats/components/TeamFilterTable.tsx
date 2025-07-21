import { DataTable, DataTableColumn } from 'mantine-datatable';
import { IFilterStats, ITableHeader } from '@/libs/types-api/src';

interface ITeamFilterTable {
  data: IFilterStats[];
  tableHeader: ITableHeader[];
}

export const TeamFilterTable = ({ data, tableHeader, }: ITeamFilterTable) => {
  if (!data?.length || !tableHeader?.length) return null;

  const columns: DataTableColumn<IFilterStats>[] = tableHeader.map((header) => ({
    accessor: header.value.toString(),
    title: header.label.toString(),
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
      height={'100%'}
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
