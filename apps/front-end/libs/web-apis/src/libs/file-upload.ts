import { AxiosProgressEvent } from 'axios';
import http from './http-common';
import { IApiResponse } from '@cricket-analysis-monorepo/interfaces';
import { apiErrorHandler } from '@/libs/utils/apiErrorHandler';
import { IFileColumnDataResponse } from '@/libs/types-api/src';

export const uploadFileToServiceViaHandler = async ({
  formData,
  onUploadProgress,
}: {
  formData: FormData;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}): Promise<IApiResponse<IFileColumnDataResponse>> => {

  try {
    const result = await http.post('/update-mapping-and-save-entries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });

    return result.data;
  } catch (error) {
    throw apiErrorHandler(error, 'uploading file to service');
  }
};