import { ITableField, ICheckMappingRequest, IFileColumnDataResponse } from '@/libs/types-api/src';
import http from './http-common';
import { IApiResponse } from '@cricket-analysis-monorepo/interfaces';

export const getDatabaseTablesAndFields = async (): Promise<IApiResponse<ITableField[]>> => {
  try {
    const response = await http.get<IApiResponse<ITableField[]>>('/api/database/table-names-and-fields');
    return response.data;
  } catch (error) {
    throw new Error(`Error while fetching table names and fields: ${error}`);
  }
};

export const checkMappingAndUpdate = async (params: ICheckMappingRequest): Promise<IApiResponse<IFileColumnDataResponse>> => {
  try {
    const result = await http.post<IApiResponse<IFileColumnDataResponse>>('/api/check-mapping-and-update', params);
    return result.data;
  } catch (error) {
    throw new Error(`Checking column mapping: ${error}`)
  }
};