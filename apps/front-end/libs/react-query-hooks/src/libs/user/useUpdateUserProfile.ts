import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateUserProfile } from '@/libs/web-apis/src';
import { IUpdateUserResponse } from '@/libs/types-api/src';
import { IApiResponse, IUser } from '@cricket-analysis-monorepo/interfaces';

export const useUpdateUserProfile = () => {
  return useMutation<IApiResponse<IUpdateUserResponse>, AxiosError, Partial<IUser>>({
    mutationKey: ['useUpdateUserProfile'],
    mutationFn: (params) => {
      return updateUserProfile(params);
    },
  });
};