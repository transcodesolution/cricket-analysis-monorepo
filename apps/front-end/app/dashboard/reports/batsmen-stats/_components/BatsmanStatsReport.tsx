'use client'
import { Box, Center, Paper, Title } from '@mantine/core';
import { ReportsFilter } from '../../_components/ReportsFilter';
import { PlayerStatsOverview } from './PlayerStatsOverview';
import { ScoringDistributionGrid } from './ScoringDistributionGrid';
import { DismissalAndRecentGames } from '../../_components/DismissalAndRecentGames';
import { usePathname, useSearchParams } from 'next/navigation';
import { useGetReportById } from '@/libs/react-query-hooks/src';
import { useMemo } from 'react';
import { IBatsmanStatsData, IOversGroupedStat } from '@/libs/types-api/src';
import { createStatTilesGroup, isBatsmanStatsData } from '@/libs/utils/ui-helper';
import PageLoader from '@/libs/custom/loaders/PageLoader';

export type TBatsmanProfileInfoData = Pick<
  IBatsmanStatsData,
  'playerName' | 'innings' | 'rpi' | 'median' | 'strikeRate' | 'sixHitInAvgMatches'
>;

export const BatsmanStatsReport = () => {
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
  } else if (!reportDetails || !isBatsmanStatsData(reportDetails)) {
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
          <Center h='100%'>
            <Title order={4} fw={500}>No Report Found</Title>
          </Center>
        </Box>
      );
      break;
    case 'hasReportData': {
      const {
        playerName,
        innings,
        rpi,
        median,
        strikeRate,
        sixHitInAvgMatches,
        runDistribution,
        scoringDistribution,
        ballByBallData,
        recentGames,
        dismissals,
        overs_phase,
        bowlingTypeStats,
        battingHandStats
      } = reportDetails as IBatsmanStatsData;

      const profileInfo: TBatsmanProfileInfoData = {
        playerName,
        innings,
        rpi,
        median,
        strikeRate,
        sixHitInAvgMatches,
      };

      const sidePanelStats: IOversGroupedStat[] = [
        createStatTilesGroup(bowlingTypeStats),
        createStatTilesGroup(overs_phase),
        createStatTilesGroup(battingHandStats),
      ];

      reportContent = (
        <>
          <PlayerStatsOverview
            profileInfo={profileInfo}
            runDistData={runDistribution}
            ballByBallData={ballByBallData}
            sidePanelStats={sidePanelStats}
          />
          <ScoringDistributionGrid title="Scoring Distribution" data={scoringDistribution} />
          <DismissalAndRecentGames
            dismissals={dismissals}
            games={recentGames}
            reportFor="batsman"
          />
        </>
      );
      break;
    }
  }

  return (
    <Paper withBorder radius="lg" p="md">
      <Title order={4} fw={500} mb="md">
        Batsmen stats
      </Title>
      <ReportsFilter reportFilters={reportFilters} />
      {reportContent}
    </Paper>
  );
};