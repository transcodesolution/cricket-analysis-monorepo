import { deleteRoles } from '@/libs/web-apis/src/libs/role';
import { IApiResponse } from '@cricket-analysis-monorepo/interfaces';
import { useMutation } from '@tanstack/react-query';

interface IDeleteRolesParams {
  roleIds: string[];
}

export const useDeleteRoles = () => {
  const deleteRolesMutation = useMutation<IApiResponse, Error, IDeleteRolesParams>({
    mutationFn: async ({ roleIds }) => deleteRoles(roleIds),
  });
  return {
    deleteRolesMutation,
  };
};
