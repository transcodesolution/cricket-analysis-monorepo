export enum Permission {
    UPLOAD_FILES = "upload_files",
    VIEW_REPORTS = "view_reports",
    VIEW_PRE_DEFINED_REPORTS = "view_pre_defined_reports",
    VIEW_CUSTOM_REPORTS = "view_custom_reports",
    AI_ANALYSIS = "ai_analysis",
    CREATE_ROLE = "create_role",
    UPDATE_ROLE = "update_role",
    VIEW_ROLE = "view_role",
    CREATE_USER = "create_user",
    UPDATE_USER = "update_user",
    UPDATE_PANEL_USER = "update_panel_user",
    VIEW_USER = "get_user",
    VIEW_PANEL_USER = "view_panel_user",
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
    user: {
        label: "Users",
        permissions: [
            { label: "Create User", value: Permission.CREATE_USER },
            { label: "Update User", value: Permission.UPDATE_USER },
            { label: "View User", value: Permission.VIEW_USER },
        ]
    },
    panelUser: {
        label: "Users",
        permissions: [
            { label: "Update Panel User", value: Permission.UPDATE_PANEL_USER },
            { label: "View Panel User", value: Permission.VIEW_PANEL_USER },
        ]
    },
};