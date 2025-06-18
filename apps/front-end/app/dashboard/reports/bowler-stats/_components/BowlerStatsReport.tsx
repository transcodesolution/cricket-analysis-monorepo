'use client';
import { Box, Center, Paper, Title } from '@mantine/core';
import { ReportsFilter } from '../../_components/ReportsFilter';
import { BowlerStatsOverview } from './BowlerStatsOverview';
import { DistributionGridOverview } from './DistributionGridOverview';
import PageLoader from '@/libs/custom/loaders/PageLoader';
import { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useGetReportById } from '@/libs/react-query-hooks/src';
import { createStatTilesGroup, isBowlerStatsData } from '@/libs/utils/ui-helper';
import { IBowlerStatsData, IOversGroupedStat } from '@/libs/types-api/src';
import { DismissalAndRecentGamesGrid } from '../../_components/DismissalAndRecentGamesGrid';

export type TBowlerProfileInfoData = Pick<IBowlerStatsData, | 'playerName' | 'innings' | 'avg' | 'strikeRate' | 'matchWhichHasLeastWickets'>;

export const BowlerStatsReport = () => {
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
  const report = getReportResponse?.data?.report;
  const reportDetails = report?.details;
  const reportFilters = getReportResponse?.data?.report?.filters || [];

  let reportStatus: 'loading' | 'noReportData' | 'hasReportData';

  if (isLoading) {
    reportStatus = 'loading';
  } else if (!reportDetails || !isBowlerStatsData(reportDetails)) {
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
        playerName,
        innings,
        avg,
        strikeRate,
        matchWhichHasLeastWickets,
        overs_phase,
        outcomeDistribution,
        deliveryOutcomes,
        recentGames,
        dismissals,
        bowlingTypeStats
      } = reportDetails as IBowlerStatsData;

      const profileInfo: TBowlerProfileInfoData = {
        playerName,
        innings,
        avg,
        strikeRate,
        matchWhichHasLeastWickets,
      };

      const sidePanelStats: IOversGroupedStat[] = [
        createStatTilesGroup(bowlingTypeStats),
        createStatTilesGroup(overs_phase),
      ];

      reportContent = (
        <>
          <BowlerStatsOverview
            profileInfo={profileInfo}
            sidePanelStats={sidePanelStats}
          />

          <DistributionGridOverview
            outcomeTitle="Outcome Distribution"
            outcomeData={outcomeDistribution}
            deliveryTitle="Delivery Outcomes"
            deliveryData={deliveryOutcomes}
          />

          <DismissalAndRecentGamesGrid
            dismissalChartData={dismissals}
            recentGames={recentGames}
            reportFor="bowler"
          />
        </>
      );
      break;
    }
  }

  return (
    <Paper withBorder radius="lg" p="md">
      <Title order={4} fw={500} mb="md">
        Bowler stats
      </Title>
      <ReportsFilter reportFilters={reportFilters} />
      {reportContent}
    </Paper>
  );
};