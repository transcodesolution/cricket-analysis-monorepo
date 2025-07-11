import { ICachedInput } from "@cricket-analysis-monorepo/interfaces";

export interface IFileColumnDataResponse {
  [fileName: string]: string[];
}
export interface IFileColumns {
  fileName: string;
  columns: string[];
}

export interface ICheckMappingRequest {
  files: IFileColumns[];
}

export interface ITableField {
  name: string;
  fields: string[];
}


export interface IMappingByUser {
  collectionName: string;
  fields: {
    [tableName: string]: string[];
  };
}

export interface IUserMappingDetail {
  fileName: string;
  mappingsByUser: IMappingByUser[];
}

export interface IUpdateAndSaveEntriesRequest {
  [fileName: string]: ICachedInput[];
}
export interface IFileProgressEvent {
  totalFiles: number;
  totalFilesProcessed: string;
  totalErroredFiles: string;
  requestUniqueId: string;
  totalAlreadyUploadedFiles: string;
}