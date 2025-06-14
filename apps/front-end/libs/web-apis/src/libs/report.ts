import { TPaginationApiResponseType } from '@cricket-analysis-monorepo/interfaces';
import http from './http-common';
import { IGetReportsResponse, IGetReportRequest, IGetReportByIdRequest, IGetReportByIdResponse } from '@/libs/types-api/src';

export const getReports = async (params: IGetReportRequest): Promise<TPaginationApiResponseType<IGetReportsResponse>> => {
  try {
    const res = await http.get<TPaginationApiResponseType<IGetReportsResponse>>('/report', { params });
    return res.data;
  } catch (error) {
    throw new Error(`Error while fetching reports: ${error}`);
  }
};

export const getReportById = async (params: IGetReportByIdRequest): Promise<TPaginationApiResponseType<IGetReportByIdResponse>> => {
  try {
    const { id, ...otherParams } = params;
    const res = await http.get<TPaginationApiResponseType<IGetReportByIdResponse>>(`/report/${id}`, { params: otherParams });
    return res.data;
  } catch (error) {
    throw new Error(`Error while fetching player report: ${error}`);
  }
};