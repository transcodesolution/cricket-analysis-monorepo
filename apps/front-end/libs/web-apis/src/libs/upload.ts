import { ITableField, ICheckMappingRequest, IFileColumnDataResponse, IUpdateAndSaveEntriesRequest } from '@/libs/types-api/src';
import http from './http-common';
import { IApiResponse, IUploadResult } from '@cricket-analysis-monorepo/interfaces';
import { AxiosProgressEvent } from 'axios';
import { apiErrorHandler } from '@/libs/utils/apiErrorHandler';

export const getDatabaseTablesAndFields = async (): Promise<IApiResponse<ITableField[]>> => {
  try {
    const response = await http.get<IApiResponse<ITableField[]>>('/database/table-names-and-fields');
    return response.data;
  } catch (error) {
    throw new Error(`Error while fetching table names and fields: ${error}`);
  }
};

export const checkMappingAndUpdate = async (params: ICheckMappingRequest): Promise<IApiResponse<IFileColumnDataResponse>> => {
  try {
    const result = await http.post<IApiResponse<IFileColumnDataResponse>>('/check-mapping-and-update', params);
    return result.data;
  } catch (error) {
    throw new Error(`Checking column mapping: ${error}`)
  }
};

export const updateMappingAndCheckRequiredInputs = async ({ formData, onUploadProgress, }: {
  formData: FormData;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}): Promise<IApiResponse<IUpdateAndSaveEntriesRequest>> => {
  try {
    const result = await http.post('/update-mapping-and-check-required-inputs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return result.data;
  } catch (error) {
    throw apiErrorHandler(error, 'updating mapping and checking required inputs');
  }
};

export const updateAndSaveEntries = async (params: IUpdateAndSaveEntriesRequest): Promise<IApiResponse<IUploadResult[]>> => {
  try {
    const result = await http.post<IApiResponse<IUploadResult[]>>('/update-input-and-save-entries', params);
    return result.data;
  } catch (error) {
    throw new Error(`Update input entries: ${error}`)
  }
};