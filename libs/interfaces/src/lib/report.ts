import { ReportFilterType } from "@cricket-analysis-monorepo/constants";
import { IPaginationApiResponseState } from "./api-response.js";
import { IODIBatsmanStat } from "./odi-batsmen-stat-report.js";

export interface IReport {
    totalData: number;
    tableHeader: { label: string, value: string }[];
    tableBody: IODIBatsmanStat[];
    tableFooter: IPaginationApiResponseState;
}

export interface ISingleFilterConfig {
    id?: string;
    selectedValues?: string[];
    isMultiSelectOption?: boolean;
    order?: number;
}

export interface IReportFilter {
    label: string;
    values: number[] | IFilterValue[];
    isMultiSelectOption: boolean;
    queryParameterKey: string;
    type: ReportFilterType;
    singleFilterConfig?: ISingleFilterConfig;
}

export interface IFilterValue {
    label?: string;
    value: string;
}