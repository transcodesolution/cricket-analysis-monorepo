
import { IGetRolesRequest } from '@/libs/types-api/src';
import { getRoles } from '@/libs/web-apis/src';
import { useQuery } from '@tanstack/react-query';

interface IUseGetRoles extends IGetRolesRequest {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetRoles = ({
  page,
  limit,
  search = '',
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetRoles) => {
  return useQuery({
    queryKey: ['getRoles', page, limit, search],
    queryFn: async () => {
      return getRoles({
        page,
        limit,
        search,
      });
    },
    enabled: enabled,
    staleTime: staleTime,
    refetchOnWindowFocus: refetchOnWindowFocus,
  });
};