'use client';
import { Paper, Title } from '@mantine/core';
import { ReportsFilter } from '../../_components/ReportsFilter';
import { BowlerStatsOverview } from './BowlerStatsOverview';
import { DistributionGridOverview } from './DistributionGridOverview';
import { DismissalAndRecentGames } from '../../_components/DismissalAndRecentGames';
import PageLoader from '@/libs/custom/loaders/PageLoader';
import { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useGetReportById } from '@/libs/react-query-hooks/src';
import { isBowlerStatsData } from '@/libs/utils/ui-helper';
import { IBowlerStatsData } from '@/libs/types-api/src';

export type BowlerProfileInfoData = Pick<IBowlerStatsData, | 'playerName' | 'innings' | 'avg' | 'strikeRate' | 'matchWhichHasLeastWickets'>;

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

  if (isLoading) {
    return <PageLoader height={'calc(100vh - 140px)'} />;
  }

  if (!reportDetails || !isBowlerStatsData(reportDetails)) {
    return (
      <Paper withBorder radius="lg" p="md" style={{ textAlign: 'center' }} h='calc(100vh - 140px)' display='flex' styles={{ root: { justifyContent: 'center', alignItems: 'center' } }}>
        <Title order={4} fw={500}>No Report Found</Title>
      </Paper>
    );
  }

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
  } = reportDetails;

  const rightPanelStatsData = [
    {
      items: [
        { title: 'RHB', value: '', subtext: '27.3 AVG\n8.5 RPO\n19.3 SR' },
        { title: 'LHB', value: '', subtext: '29.0 AVG\n8.7 RPO\n19.9 SR' },
      ],
    },
    {
      items: overs_phase.map((item) => ({
        title: item.title,
        subtext: item.subtext,
      })),
    },
  ];

  const profileInfo: BowlerProfileInfoData = {
    playerName,
    innings,
    avg,
    strikeRate,
    matchWhichHasLeastWickets,
  };

  return (
    <Paper withBorder radius="lg" p="md">
      <Title order={4} fw={500} mb="md">Bowler stats</Title>
      <ReportsFilter reportFilters={reportFilters} />
      <BowlerStatsOverview profileInfo={profileInfo} rightPanelStatsData={rightPanelStatsData} />
      <DistributionGridOverview outcomeTitle="Outcome Distribution" outcomeData={outcomeDistribution} deliveryTitle="Delivery Outcomes" deliveryData={deliveryOutcomes} />
      <DismissalAndRecentGames dismissals={dismissals} games={recentGames} playerType="bowler" />
    </Paper>
  );
};
