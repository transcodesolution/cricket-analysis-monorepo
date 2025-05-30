import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IApiResponse } from '@cricket-analysis-monorepo/interfaces';
import { IUpdateAndSaveEntriesRequest, IUpdateAndSaveEntriesResponse } from '@/libs/types-api/src';
import { updateAndSaveEntries } from '@/libs/web-apis/src';

export const useUpdateAndSaveEntries = () => {
  return useMutation<IApiResponse<IUpdateAndSaveEntriesResponse[]>, AxiosError, IUpdateAndSaveEntriesRequest>({
    mutationKey: ['updateAndSaveEntries'],
    mutationFn: (params) => updateAndSaveEntries(params),
  });
};
