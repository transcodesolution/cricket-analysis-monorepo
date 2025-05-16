import { getRoleById } from '@/libs/web-apis/src';
import { useQuery } from '@tanstack/react-query';

export const useGetRoleById = ({
  roleId,
  enabled
}: { roleId: string, enabled?: boolean }) => {
  return useQuery({
    queryKey: ['getRoleById', roleId],
    queryFn: async () => getRoleById(roleId),
    refetchOnWindowFocus: false,
    enabled
  });
};
