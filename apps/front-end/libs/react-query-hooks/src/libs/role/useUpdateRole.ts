import { updateRole } from '@/libs/web-apis/src/libs/role';
import { IApiResponse, IUserRole } from '@cricket-analysis-monorepo/interfaces';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useUpdateRole = () => {
  return useMutation<IApiResponse<IUserRole>, AxiosError, Partial<IUserRole>>({
    mutationKey: ['useUpdateRole'],
    mutationFn: (params) => {
      return updateRole(params);
    },
  });
};
