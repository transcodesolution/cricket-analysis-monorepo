export enum Permission {
    UPLOAD_FILES = "upload_files",
    VIEW_REPORTS = "view_reports",
    VIEW_PRE_DEFINED_REPORTS = "view_pre_defined_reports",
    VIEW_CUSTOM_REPORTS = "view_custom_reports",
    AI_ANALYSIS = "ai_analysis",
    CREATE_ROLE = "create_role",
    UPDATE_ROLE = "update_role",
    VIEW_ROLE = "view_role",
}

export const permissionsListByModuleWise: Record<string, { label: string, permissions: { label: string, value: Permission }[] }> = {
    upload: {
        label: "Upload Module",
        permissions: [
            { label: "Upload Files", value: Permission.UPLOAD_FILES },
        ]
    },
    reports: {
        label: "Report Module",
        permissions: [
            { label: "View All Reports", value: Permission.VIEW_REPORTS },
            { label: "View Pre Defined Reports", value: Permission.VIEW_PRE_DEFINED_REPORTS },
            { label: "View Custom Reports", value: Permission.VIEW_CUSTOM_REPORTS },
        ]
    },
    aiAnalysis: {
        label: "AI Analysis",
        permissions: [
            { label: "Ask AI", value: Permission.AI_ANALYSIS },
        ]
    },
    rolesAndPermission: {
        label: "Roles And Permission",
        permissions: [
            { label: "Create Role", value: Permission.CREATE_ROLE },
            { label: "Update Role", value: Permission.UPDATE_ROLE },
            { label: "View Role", value: Permission.VIEW_ROLE },
        ]
    },
};