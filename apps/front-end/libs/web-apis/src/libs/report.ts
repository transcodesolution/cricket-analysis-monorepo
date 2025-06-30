import { TPaginationApiResponseType } from '@cricket-analysis-monorepo/interfaces';
import http from './http-common';
import { IGetReportsResponse, IGetReportRequest, IGetReportByIdRequest, IGetReportByIdResponse, IGetReportFiltersResponse } from '@/libs/types-api/src';

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

export const getReportFilters = async (name: string): Promise<TPaginationApiResponseType<IGetReportFiltersResponse>> => {
  try {
    const res = await http.get<TPaginationApiResponseType<IGetReportFiltersResponse>>(`/report/filters/${name}`);
    return res.data;
  } catch (error) {
    throw new Error(`Error while fetching filters for report ${name}: ${error}`);
  }
};