import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IApiResponse } from '@cricket-analysis/interfaces';
import { IFileColumnDataResponse, ICheckMappingRequest } from '@/libs/types-api/src';
import { checkMappingAndUpdate } from '@/libs/web-apis/src';

export const useCheckMappingAndUpdate = () => {
  return useMutation<IApiResponse<IFileColumnDataResponse>, AxiosError, ICheckMappingRequest>({
    mutationKey: ['checkMappingAndUpdate'],
    mutationFn: (params) => checkMappingAndUpdate(params),
  });
};
