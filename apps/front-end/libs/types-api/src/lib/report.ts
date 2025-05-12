import { IReportFilter } from "@cricket-analysis-monorepo/interfaces";

export interface IGetReportRequest {
  page: number;
  limit: number;
}

export interface IReport {
  _id: string,
  name: string
}
export interface IGetReportsResponse {
  reports: IReport[];
  totalData: number;
}

export interface IGetReportByIdRequest {
  page: number;
  limit: number;
  [key: string]: string | number | string[];
  id: string
}

export interface ITableHeader {
  label: string;
  value: string;
}

export interface ITableRow {
  [key: string]: string | number;
}

export interface IGetReportByIdResponse {
  report: {
    name: string;
    details: {
      tableBody: ITableRow[];
      tableHeader: ITableHeader[];
    };
    filters: IReportFilter[];
  };
  totalData: number;
}