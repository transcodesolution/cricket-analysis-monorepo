'use client';
import { Paper, Title, Grid, ScrollArea, Flex, Loader } from '@mantine/core';
import React, { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useGetReportById, useGetReportFilters } from '@/libs/react-query-hooks/src';

import { ReportFilter } from '../../[reportId]/_components/ReportFilter';
import { TeamReportTable } from './TeamReportTable';
import { isTeamPerformanceStatsData } from '@/libs/utils/ui-helper';
import { ITeamPerformanceData } from '@/libs/types-api/src';
import { teamPerformanceColumns } from '../../_components/columns/teamPerformanceColumns';
import { TeamFilterTable } from './TeamFilterTable';

const TeamPerformanceReport = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const reportType = pathSegments[pathSegments.length - 1];
  const searchParams = useSearchParams();

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
      id: reportType,
      page: 1,
      limit: 10,
      ...formattedFilters,
    },
  });

  const { data: getFiltersResponse } = useGetReportFilters({
    reportName: reportType,
    enabled: !!reportType,
  });

  const report = getReportResponse?.data?.report;
  const reportDetails = report?.details;
  const reportFilters = getFiltersResponse?.data?.report?.filters || [];
  const totalData = getReportResponse?.data?.totalData || 0;
  const reportName = getFiltersResponse?.data?.report?.name

  let reportStatus: 'loading' | 'noReportData' | 'hasReportData' = 'loading';

  if (!isLoading) {
    reportStatus = !reportDetails || !isTeamPerformanceStatsData(reportDetails)
      ? 'noReportData'
      : 'hasReportData';
  }

  let reportContent: React.ReactNode;

  switch (reportStatus) {
    case 'loading':
      reportContent = <Flex align='start' h="calc(100vh - 34.375rem)" w='100%' justify='center'>
        <Loader />
      </Flex >;
      break;

    case 'noReportData':
      reportContent = (
        <Flex align='start' h="calc(100vh - 34.375rem)" w='100%' justify='center'>
          <Title order={4} fw={500}>
            No Report Found
          </Title>
        </Flex >
      );
      break;

    case 'hasReportData': {
      const { matches, tableHeader, filterData } =
        reportDetails as ITeamPerformanceData;
      const columns = teamPerformanceColumns(matches, tableHeader);

      reportContent = (
        <React.Fragment>
          <Grid.Col span={9}>
            <TeamFilterTable
              data={filterData.stats}
              tableHeader={filterData.tableHeader}
            />
          </Grid.Col>
          <Grid.Col span={12} >
            <TeamReportTable
              data={matches}
              columns={columns}
              totalData={totalData}
              isLoading={false}
            />
          </Grid.Col>
        </React.Fragment>
      );
      break;
    }
  }

  return (
    <Paper withBorder radius="lg" p="md">
      <Title order={4} fw={500} mb="md">
        {reportName}
      </Title>
      <Grid>
        <Grid.Col span={3}>
          <ScrollArea h="calc(100vh - 37.5rem)" scrollbars="y">
            <ReportFilter reportFilters={reportFilters} width="100%" />
          </ScrollArea>
        </Grid.Col>
        {reportContent}
      </Grid>
    </Paper>
  );
};


export default TeamPerformanceReport;
