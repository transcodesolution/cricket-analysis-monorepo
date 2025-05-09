export interface IGetReportRequest {
  page: number;
  limit: number;
}

export interface IReports {
  _id: string,
  name: string
}
export interface IGetReportsResponse {
  reports: IReports[];
  totalData: number;
}

export interface IGetReportByIdRequest {
  page: number;
  limit: number;
  [key: string]: string | number;
  id: string
}

export interface IReportFilters {
  label: string;
  values: Array<{ label: string; value: string }>;
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
    filters: IReportFilters[];
  };
  totalData: number;
}