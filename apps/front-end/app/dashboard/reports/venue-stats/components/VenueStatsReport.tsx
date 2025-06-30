'use client'
import { Box, Center, Paper, Title } from '@mantine/core';
import PageLoader from '@/libs/custom/loaders/PageLoader';
import { useGetReportById, useGetReportFilters } from '@/libs/react-query-hooks/src';
import { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ReportsFilter } from '../../_components/ReportsFilter';
import { createStatTilesGroup, isVenueStatsData } from '@/libs/utils/ui-helper';
import { VenueStatsOverview } from './VenueStatsOverview';
import { RunDistributionGrid } from '../../_components/RunDistributionGrid';
import { IOversGroupedStat, IVenueStatsData } from '@/libs/types-api/src';
import { DismissalAndRecentGamesGrid } from '../../_components/DismissalAndRecentGamesGrid';

export const VenueStatsReport = () => {
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

  const formattedFilters = useMemo
    (() => {
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

  const { data: getFiltersResponse } = useGetReportFilters({ reportName: reportType, enabled: !!reportType });

  const report = getReportResponse?.data?.report;
  const reportDetails = report?.details;
  const reportFilters = getFiltersResponse?.data?.report?.filters || [];

  let reportStatus: 'loading' | 'noReportData' | 'hasReportData';

  if (isLoading) {
    reportStatus = 'loading';
  } else if (!reportDetails || !isVenueStatsData(reportDetails)) {
    reportStatus = 'noReportData';
  } else {
    reportStatus = 'hasReportData';
  }

  let reportContent: React.ReactNode;

  switch (reportStatus) {
    case 'loading':
      reportContent = <PageLoader height="calc(100vh - 215px)" />;
      break;

    case 'noReportData':
      reportContent = (
        <Box h="calc(100vh - 298px)">
          <Center h="100%">
            <Title order={4} fw={500}>
              No Report Found
            </Title>
          </Center>
        </Box>
      );
      break;

    case 'hasReportData': {
      const {
        venues,
        overs_phase,
        recentGames,
        dismissals,
        innings,
        runDistribution,
        battingHandStats,
        bowlingTypeStats
      } = reportDetails as IVenueStatsData;

      const sidePanelStats: IOversGroupedStat[] = [
        createStatTilesGroup(bowlingTypeStats),
        createStatTilesGroup(overs_phase),
        createStatTilesGroup(battingHandStats),
      ];

      const inningsStats = [{ items: innings }];

      reportContent = (
        <>
          <VenueStatsOverview venues={venues} inningsStats={inningsStats} sidePanelStats={sidePanelStats} />
          <RunDistributionGrid title="Run Distribution" runDistData={runDistribution} />
          <DismissalAndRecentGamesGrid
            dismissalChartData={dismissals}
            recentGames={recentGames}
            reportFor="venue"
          />
        </>
      );
      break;
    }
  }

  return (
    <Paper withBorder radius="lg" p="md">
      <Title order={4} fw={500} mb="md">
        Venue stats
      </Title>
      <ReportsFilter reportFilters={reportFilters} />
      {reportContent}
    </Paper>
  );
};