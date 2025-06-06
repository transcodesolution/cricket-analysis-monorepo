'use client';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Button, Flex, Paper, Stack, Title } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useMemo } from 'react';
import * as XLSX from 'xlsx';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useGetReportById } from '@/libs/react-query-hooks/src';
import { ITableHeader, ITableRow } from '@/libs/types-api/src';
import { ReportFilter } from './ReportFilter';
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';

const PAGE_SIZES = [10, 20, 50, 100];

export const ReportTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];

  const { reportId } = useParams<{ reportId: string }>();

  const filters = useMemo<Record<string, string>>(() => {
    const f: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      if (value && value !== 'all' && key !== '_rsc') {
        const matched = key.match(/^filters\[(.+?)\]$/);
        if (matched) {
          f[matched[1]] = value;
        } else {
          f[key] = value;
        }
      }
    }
    return f;
  }, [searchParams]);

  // 🔄 Convert comma values to arrays dynamically
  const formattedFilters = useMemo(() => {
    return Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [
        key,
        value.includes(',') ? value.split(',') : value,
      ])
    );
  }, [filters]);

  const { data: getReportResponse, isLoading } = useGetReportById({
    params: {
      page,
      limit: pageSize,
      id: reportId,
      ...formattedFilters,
    },
  });

  const report = getReportResponse?.data?.report;
  const reportFilters = getReportResponse?.data?.report?.filters || [];
  const reportData = report?.details?.tableBody ?? [];
  const tableHeaders = report?.details?.tableHeader ?? [];
  const totalRecords = getReportResponse?.data?.totalData ?? 0;

  const columns: DataTableColumn<ITableRow>[] = tableHeaders.map((header: ITableHeader) => ({
    accessor: header.value,
    title: header.label,
  }));

  const downloadExcel = () => {
    if (!reportData.length) return;

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Player Report');
    XLSX.writeFile(wb, 'player_report.xlsx');
  };


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
    <Stack>
      <Paper withBorder radius="lg" p="md">
        <Flex justify="space-between" align="center" w='100%'>
          <Title order={4} fw={500} mb="md" c="var(--mantine-color-gray-8)">
            {report?.name || 'Report'}
          </Title>
          <Button
            leftSection={<IconDownload size={18} />}
            size="sm"
            color="var(--mantine-color-customBlue-5)"
            onClick={downloadExcel}
          >
            Download
          </Button>
        </Flex>

        <ReportFilter reportFilters={reportFilters} />

        <DataTable
          mt="md"
          idAccessor="playerId"
          borderRadius="lg"
          fetching={isLoading}
          withTableBorder
          withRowBorders={false}
          highlightOnHover
          verticalSpacing="xs"
          records={reportData}
          totalRecords={totalRecords}
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
          }}
          height="calc(100vh - 408px)"
        />
      </Paper>
    </Stack>
  );
};
