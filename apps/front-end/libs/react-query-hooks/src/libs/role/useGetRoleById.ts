import { getRoleById } from '@/libs/web-apis/src/libs/role';
import { useQuery } from '@tanstack/react-query';

export const useGetRoleById = ({
  roleId
}: { roleId: string }) => {
  return useQuery({
    queryKey: ['getRoleById', roleId],
    queryFn: async () => getRoleById(roleId),
    refetchOnWindowFocus: false,
  });
};
