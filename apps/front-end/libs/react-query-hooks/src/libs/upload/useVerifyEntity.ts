import { verifyEntity } from '@/libs/web-apis/src';
import { IApiResponse } from '@cricket-analysis-monorepo/interfaces';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useVerifyEntity = () => {
  return useMutation<IApiResponse, AxiosError, { entityType: string; name: string }>({
    mutationKey: ['useVerifyEntity'],
    mutationFn: ({ entityType, name }) => verifyEntity(entityType, name),
  });
};
