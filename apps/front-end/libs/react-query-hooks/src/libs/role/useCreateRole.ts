import { createRole } from '@/libs/web-apis/src';
import { IApiResponse, IUserRole } from '@cricket-analysis-monorepo/interfaces';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useCreateRole = () => {
  return useMutation<IApiResponse<IUserRole>, AxiosError, Partial<IUserRole>>({
    mutationKey: ['useCreateRole'],
    mutationFn: (params) => {
      return createRole(params);
    },
  });
};
