import { ICachedInput, IUnmappedKey } from "@cricket-analysis-monorepo/interfaces";

export interface IFileColumnDataResponse {
  unmappedKeys: IUnmappedKey[];
  fileNames: string[];
}
export interface IFileColumns {
  fileName?: string;
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
  fileNames: string[];
  mappingsByUser: IMappingByUser[];
}

export type TFileCachedInput = ICachedInput & {
  typedValue?: string;
  isUserTypedValue?: boolean;
};

export interface IUpdateAndSaveEntriesRequest {
  [fileName: string]: TFileCachedInput[];
}