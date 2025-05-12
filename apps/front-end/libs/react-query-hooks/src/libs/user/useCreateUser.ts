import { createUser } from '@/libs/web-apis/src';
import { IApiResponse, IUser } from '@cricket-analysis-monorepo/interfaces';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useCreateUser = () => {
  return useMutation<IApiResponse<IUser>, AxiosError, Partial<IUser>>({
    mutationKey: ['useCreateUser'],
    mutationFn: (params) => {
      return createUser(params);
    },
  });
};