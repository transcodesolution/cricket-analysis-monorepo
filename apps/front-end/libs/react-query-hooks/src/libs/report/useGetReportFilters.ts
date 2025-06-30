import { useQuery } from '@tanstack/react-query';
import { getReportFilters } from '@/libs/web-apis/src';

interface IUseGetReportFilters {
  reportName: string;
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}

export const useGetReportFilters = ({
  reportName,
  staleTime = 1000 * 60 * 10,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetReportFilters) => {
  return useQuery({
    queryKey: ['reportFilters', reportName],
    queryFn: () => getReportFilters(reportName),
    enabled: !!reportName && enabled,
    staleTime,
    refetchOnWindowFocus,
  });
};