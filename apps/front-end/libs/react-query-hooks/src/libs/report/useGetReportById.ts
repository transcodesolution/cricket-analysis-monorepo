import { useQuery } from '@tanstack/react-query';
import { getReportById } from '@/libs/web-apis/src';
import { IGetReportByIdRequest } from '@/libs/types-api/src';


interface IUseGetReportById {
  params: IGetReportByIdRequest;
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}

export const useGetReportById = ({
  params,
  staleTime = 1000 * 60 * 0.5,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetReportById) => {
  const queryKey = ['reportData', params];
  return useQuery({
    queryKey,
    queryFn: () => getReportById(params),
    enabled,
    staleTime,
    refetchOnWindowFocus,
  });
};