
import { useQuery } from '@tanstack/react-query';
import { getReports } from '@/libs/web-apis/src';
import { IGetReportRequest } from '@/libs/types-api/src';


interface IUseGetReports extends IGetReportRequest {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}

export const useGetReports = ({
  staleTime = 1000 * 60 * 0.5,
  enabled = true,
  refetchOnWindowFocus = false,
  page, limit
}: IUseGetReports) => {
  const queryKey = ['reports', page, limit];
  return useQuery({
    queryKey,
    queryFn: () => getReports({ page, limit }),
    enabled,
    staleTime,
    refetchOnWindowFocus,
  });
};