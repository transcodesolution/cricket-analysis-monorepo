import { PaginationApiResponseType } from '@cricket-analysis/interfaces';
import http from './http-common';
import { IGetReportsResponse, IGetReportRequest, IGetReportByIdRequest, IGetReportByIdResponse } from '@/libs/types-api/src';

export const getReports = async (params: IGetReportRequest): Promise<PaginationApiResponseType<IGetReportsResponse>> => {
  try {
    const res = await http.get<PaginationApiResponseType<IGetReportsResponse>>('/api/report', { params });
    return res.data;
  } catch (error) {
    throw new Error(`Error while fetching reports: ${error}`);
  }
};

export const getReportById = async (params: IGetReportByIdRequest): Promise<PaginationApiResponseType<IGetReportByIdResponse>> => {
  try {
    const { id, ...otherParams } = params;
    const res = await http.get<PaginationApiResponseType<IGetReportByIdResponse>>(`/api/report/${id}`, { params: otherParams });
    return res.data;
  } catch (error) {
    throw new Error(`Error while fetching player report: ${error}`);
  }
};