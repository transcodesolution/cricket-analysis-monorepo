export interface IFileProgressData {
  totalFiles: number;
  totalFilesProcessed: string;
  totalErroredFiles: string;
  requestUniqueId: string;
  totalAlreadyUploadedFiles: string;
}

export interface IFileProgressResponse {
  success: boolean;
  message: string;
  data: IFileProgressData;
}