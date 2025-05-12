'use client';
import { DataTable } from 'mantine-datatable';
import { Paper, Stack, Title, Anchor } from '@mantine/core';
import { useState } from 'react';
import Link from 'next/link';
import { useGetReports } from '@/libs/react-query-hooks/src';

const PAGE_SIZES = [10, 20];

export const ReportList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const { data: getReports, isLoading } = useGetReports({
    page,
    limit: pageSize,
  })

  const reports = getReports?.data?.reports || [];
  const totalData = getReports?.data?.totalData

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
          onPageChange={setPage}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          columns={[
            {
              accessor: 'name',
              title: 'Report Name',
              ellipsis: true,
              sortable: true,
              width: 250,
              render: ({ _id, name }) => (
                <Anchor component={Link} href={`/dashboard/reports/${_id}`} style={{ position: 'relative' }}>
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
