import { getUserProfile } from '@/libs/web-apis/src';
import { useQuery } from '@tanstack/react-query';

interface IUseGetUserProfile {
  staleTime?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export const useGetUserProfile = ({
  staleTime = 1000 * 60 * 0.2,
  enabled = true,
  refetchOnWindowFocus = false,
}: IUseGetUserProfile) => {
  return useQuery({
    queryKey: ['getUser'],
    queryFn: async () => getUserProfile(),
    enabled,
    staleTime,
    refetchOnWindowFocus,
  });
};
