'use client';
import { DataTable } from 'mantine-datatable';
import { Paper, Stack, Title, Anchor } from '@mantine/core';
import Link from 'next/link';
import { useGetReports } from '@/libs/react-query-hooks/src';
import { useRouter, useSearchParams } from 'next/navigation';
import { IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams';

const PAGE_SIZES = [10, 20, 50, 100];

export const ReportList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZES[0];

  const { data: getReports, isLoading } = useGetReports({
    page,
    limit: pageSize,
  })

  const reports = getReports?.data?.reports || [];
  const totalData = getReports?.data?.totalData


  const handleChangePage = (pageNumber: number) => {
    handleApplyFilter({ 'page': pageNumber.toString() })
  };

  const handleChangePageSize = (pageNumber: number) => {
    handleApplyFilter({ 'pageSize': pageNumber.toString() })
  };

  const handleApplyFilter = (filters: IFilterParams) => {
    const newSearchParams = updateUrlParams(filters);
    router.push(`${newSearchParams.toString()}`);
  };

  return (
    <Stack>
      <Paper withBorder radius="lg" p="md">
        <Title order={4} fw={500} mb="md" c="var(--mantine-color-gray-8)">
          Selection Report
        </Title>
        <DataTable
          idAccessor="_id"
          withTableBorder
          borderRadius="lg"
          fetching={isLoading}
          highlightOnHover
          verticalSpacing="xs"
          records={reports}
          totalRecords={totalData}
          paginationActiveBackgroundColor="var(--mantine-color-customBlue-5)"
          recordsPerPage={pageSize}
          page={page}
          onPageChange={handleChangePage}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={handleChangePageSize}
          columns={[
            {
              accessor: 'name',
              title: 'Report Name',
              ellipsis: true,
              sortable: true,
              width: 250,
              render: ({ uniqueKey, name }) => (
                <Anchor component={Link} href={`/dashboard/reports/${uniqueKey}`} style={{ position: 'relative' }}>
                  {name}
                </Anchor>
              ),
            },
          ]}
          c="var(--mantine-color-gray-7)"
          styles={{
            header: {
              backgroundColor: 'var(--mantine-color-gray-1)',
              color: 'var(--mantine-color-gray-7)',
            },
          }}
          height="calc(100vh - 400px)"
        />
      </Paper>
    </Stack>
  );
};
