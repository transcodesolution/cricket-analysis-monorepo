import { Permission } from "@cricket-analysis-monorepo/constants";

export interface IGetPermissionsResponse {
  message: string;
  data: {
    permissions: Permission[]
  }
}