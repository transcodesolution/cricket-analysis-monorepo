import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateUser } from '@/libs/web-apis/src';
import { IUpdateUserResponse } from '@/libs/types-api/src';
import { IApiResponse, IUser } from '@cricket-analysis-monorepo/interfaces';

export const useUpdateUser = () => {
  return useMutation<IApiResponse<IUpdateUserResponse>, AxiosError, Partial<IUser>>({
    mutationKey: ['useUpdateUser'],
    mutationFn: (params) => {
      return updateUser(params);
    },
  });
};