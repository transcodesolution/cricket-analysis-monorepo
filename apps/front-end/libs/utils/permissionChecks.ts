import { Permission } from "@cricket-analysis-monorepo/constants";

export const PERMISSION_CONFIG: { [key: string]: Permission[] } = {
  hasFileUpload: [Permission.UPLOAD_FILES],

  hasReportAccess: [Permission.VIEW_REPORTS],
  hasPreDefinedReportAccess: [Permission.VIEW_PRE_DEFINED_REPORTS],
  hasCustomReportAccess: [Permission.VIEW_CUSTOM_REPORTS],

  hasAiAnalysisAccess: [Permission.AI_ANALYSIS],

  hasRoleCreate: [Permission.CREATE_ROLE],
  hasRoleUpdate: [Permission.UPDATE_ROLE],
  hasRoleRead: [Permission.VIEW_ROLE],

  hasUserCreate: [Permission.CREATE_USER],
  hasUserUpdate: [Permission.UPDATE_USER],
  hasPanelUserUpdate: [Permission.UPDATE_PANEL_USER],
  hasUserRead: [Permission.VIEW_USER],
  hasPanelUserRead: [Permission.VIEW_PANEL_USER],
};
