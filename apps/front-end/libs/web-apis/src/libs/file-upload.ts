import { AxiosProgressEvent } from 'axios';
import http, { BASE_API_URL } from './http-common';
import { IApiResponse } from '@cricket-analysis/interfaces';
import { apiErrorHandler } from '@/libs/utils/apiErrorHandler';
import { IFileColumnDataResponse } from '@/libs/types-api/src';

export const uploadFileToServiceViaHandler = async ({
  formData,
  onUploadProgress,
}: {
  formData: FormData;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}): Promise<IApiResponse<IFileColumnDataResponse>> => {

  const url = `${BASE_API_URL}/api/update-mapping-and-save-entries`;
  try {
    const result = await http.post(url, formData, {
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