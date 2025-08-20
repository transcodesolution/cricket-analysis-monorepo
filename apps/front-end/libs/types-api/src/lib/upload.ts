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

export type TFileCachedInput = ICachedInput & {
  fileId?: string;
};

export interface IUpdateAndSaveEntriesRequest {
  [fileName: string]: TFileCachedInput[];
}
export interface IFileProgressEvent {
  totalFiles: number;
  totalFilesProcessed: string;
  totalErroredFiles: string;
  requestUniqueId: string;
  totalAlreadyUploadedFiles: string;
}