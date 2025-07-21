import { ITeamPerformanceMatch } from '@/libs/types-api/src';
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useRouter, useSearchParams } from 'next/navigation';

const PAGE_SIZES = [10, 20, 50, 100];

interface ITeamReportTableData {
  data: ITeamPerformanceMatch[];
  columns: DataTableColumn<ITeamPerformanceMatch>[];
  totalData: number;
  isLoading: boolean;
}

export const TeamReportTable = ({ data, columns, totalData, isLoading }: ITeamReportTableData) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];
  const router = useRouter();

  const handleApplyFilter = (filters: IFilterParams) => {
    const newSearchParams = updateUrlParams(filters);
    router.push(`${newSearchParams.toString()}`);
  };

  const handleChangePage = (pageNumber: number) => {
    handleApplyFilter({ 'page': pageNumber.toString() })
  };

  const handleChangePageSize = (pageNumber: number) => {
    handleApplyFilter({ 'pageSize': pageNumber.toString() })
  };
  return (
    <DataTable
      idAccessor="_id"
      borderRadius="lg"
      withTableBorder
      withRowBorders={true}
      highlightOnHover
      fetching={isLoading}
      verticalSpacing="xs"
      records={data}
      totalRecords={totalData}
      paginationActiveBackgroundColor="var(--mantine-color-customBlue-5)"
      recordsPerPage={pageSize}
      page={page}
      onPageChange={handleChangePage}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={handleChangePageSize}
      columns={columns}
      c="var(--mantine-color-gray-7)"
      styles={{
        header: {
          backgroundColor: 'var(--mantine-color-gray-1)',
          color: 'var(--mantine-color-gray-7)',
        },
        pagination: {
          flexDirection: 'row',
        },
      }}
      height="calc(100vh - 550px)"
    />
  );
};
