export enum Permission {
    UPLOAD_FILES = "upload_files",
    VIEW_REPORTS = "view_reports",
    VIEW_PRE_DEFINED_REPORTS = "view_pre_defined_reports",
    VIEW_CUSTOM_REPORTS = "view_custom_reports",
    AI_ANALYSIS = "ai_analysis",
    CREATE_ROLE = "create_role",
    UPDATE_ROLE = "update_role",
    DELETE_ROLE = "delete_role",
    VIEW_ROLE = "view_role",
    CREATE_USER = "create_user",
    UPDATE_USER = "update_user",
    DELETE_USER = "delete_user",
    VIEW_USER = "get_user",
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
            { label: "Delete Role", value: Permission.DELETE_ROLE },
            { label: "View Role", value: Permission.VIEW_ROLE },
        ]
    },
    user: {
        label: "Users",
        permissions: [
            { label: "Create User", value: Permission.CREATE_USER },
            { label: "Update User", value: Permission.UPDATE_USER },
            { label: "Delete User", value: Permission.DELETE_USER },
            { label: "View User", value: Permission.VIEW_USER },
        ]
    }
};