import { Permission, UserRoleType } from '@cricket-analysis-monorepo/constants';

export interface IUserRole {
    name: string;
    type: UserRoleType;
    permissions: Permission[];
}