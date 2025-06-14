'use client'
import { Paper, Title } from '@mantine/core';
import PageLoader from '@/libs/custom/loaders/PageLoader';
import { useGetReportById } from '@/libs/react-query-hooks/src';
import { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ReportsFilter } from '../../_components/ReportsFilter';
import { isVenueStatsData } from '@/libs/utils/ui-helper';
import { VenueStatsOverview } from './VenueStatsOverview';
import { RunDistributionGrid } from '../../_components/RunDistributionGrid';
import { DismissalAndRecentGames } from '../../_components/DismissalAndRecentGames';

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
  const report = getReportResponse?.data?.report;
  const reportDetails = report?.details;
  const reportFilters = getReportResponse?.data?.report?.filters || [];

  if (isLoading) {
    return <PageLoader height={'calc(100vh - 140px)'} />;
  }

  if (!reportDetails || !isVenueStatsData(reportDetails)) {
    return (
      <Paper withBorder radius="lg" p="md" style={{ textAlign: 'center' }} h='calc(100vh - 140px)' display='flex' styles={{ root: { justifyContent: 'center', alignItems: 'center' } }}>
        <Title order={4} fw={500}>No Report Found</Title>
      </Paper>
    );
  }

  const {
    venues,
    overs_phase,
    recentGames,
    dismissals,
    innings,
    runDistribution
  } = reportDetails;

  const rightPanelStatsData = [
    {
      items: [
        {
          title: 'RHB',
          subtext: '28.0 AVG\n141.4 SR',
        },
        {
          title: 'LHB',
          subtext: '29.4 AVG\n141.3 SR',
        },
      ],
    },
    {
      items: overs_phase,
    },
    {
      items: [
        {
          title: 'Seam',
          subtext: '29.1 AVG\n9.2 RPO  19.0 SR\n63.3% of balls',
        },
        {
          title: 'Spin',
          subtext: '30.5 AVG\n8.2 RPO  22.3 SR\n36.7% of balls',
        },
      ],
    },
  ];

  const inningsStats = [{
    items: innings
  }]
  return (
    <Paper withBorder radius="lg" p="md">
      <Title order={4} fw={500} mb="md">Venue stats</Title>
      <ReportsFilter reportFilters={reportFilters} />
      <VenueStatsOverview venues={venues} inningsStats={inningsStats} rightPanelStatsData={rightPanelStatsData} />
      <RunDistributionGrid title="Run Distribution" runDistData={runDistribution} />
      <DismissalAndRecentGames dismissals={dismissals} games={recentGames} playerType='venue' />
    </Paper>
  )
};