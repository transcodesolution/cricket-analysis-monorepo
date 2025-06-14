'use client'
import { Paper, Title } from '@mantine/core';
import { ReportsFilter } from '../../_components/ReportsFilter';
import { PlayerStatsOverview } from './PlayerStatsOverview';
import { ScoringDistributionGrid } from './ScoringDistributionGrid';
import { DismissalAndRecentGames } from '../../_components/DismissalAndRecentGames';
import { usePathname, useSearchParams } from 'next/navigation';
import { useGetReportById } from '@/libs/react-query-hooks/src';
import { useMemo } from 'react';
import { IBatsmanStatsData } from '@/libs/types-api/src';
import { isBatsmanStatsData } from '@/libs/utils/ui-helper';
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

  if (isLoading) {
    return <PageLoader height={'calc(100vh - 140px)'} />;
  }

  if (!reportDetails || !isBatsmanStatsData(reportDetails)) {
    return (
      <Paper withBorder radius="lg" p="md" style={{ textAlign: 'center' }} h='calc(100vh - 140px)' display='flex' styles={{ root: { justifyContent: 'center', alignItems: 'center' } }}>
        <Title order={4} fw={500}>No Report Found</Title>
      </Paper>
    );
  }

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
    overs_phase
  } = reportDetails;

  const profileInfo: TBatsmanProfileInfoData = {
    playerName,
    innings,
    rpi,
    median,
    strikeRate,
    sixHitInAvgMatches,
  };

  const rightPanelStatsData = [
    {
      items: [
        {
          title: 'Seam',
          subtext: '36.2 AVG\n142.3 SR',
        },
        {
          title: 'Spin',
          subtext: '37.4 AVG\n142.3 SR',
        },
      ],
    },
    {
      items: overs_phase.map((item) => ({
        title: item.title,
        subtext: item.subtext,
      })),
    },
    {
      items: [
        {
          title: 'RFM',
          subtext: '37.0 AVG\n133.2 SR',
        },
        {
          title: 'RLB',
          subtext: '44.2 AVG\n137.7 SR',
        },
        {
          title: 'ROB',
          subtext: '34.4 AVG\n140.3 SR',
        },
        {
          title: 'LOB',
          subtext: '30.8 AVG\n148.4 SR',
        },
        {
          title: 'LLB',
          subtext: '34.0 AVG\n148.4 SR',
        },
        {
          title: 'LFM',
          subtext: '34.2 AVG\n138.1 SR',
        },
      ],
    },
  ];


  return (
    <Paper withBorder radius="lg" p="md">
      <Title order={4} fw={500} mb="md">Batsmen stats</Title>
      <ReportsFilter reportFilters={reportFilters} />
      <PlayerStatsOverview profileInfo={profileInfo} runDistData={runDistribution} ballByBallData={ballByBallData} rightPanelStatsData={rightPanelStatsData} />
      <ScoringDistributionGrid title="Scoring Distribution" data={scoringDistribution} />
      <DismissalAndRecentGames dismissals={dismissals} games={recentGames} playerType='batsman' />
    </Paper>
  )
};