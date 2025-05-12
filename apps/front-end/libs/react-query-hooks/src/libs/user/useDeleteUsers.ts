
import { deleteUsers } from '@/libs/web-apis/src';
import { IApiResponse } from '@cricket-analysis-monorepo/interfaces';
import { useMutation } from '@tanstack/react-query';

interface IDeleteUsersParams {
  ids: string[];
}

export const useDeleteUsers = () => {
  const deleteUsersMutation = useMutation<IApiResponse, Error, IDeleteUsersParams>({
    mutationFn: async ({ ids }) => deleteUsers(ids),
  });
  return {
    deleteUsersMutation,
  };
};
