import { Permission, UserRoleType } from '@cricket-analysis-monorepo/constants';

export interface IUserRole {
    _id: string;
    name: string;
    type: UserRoleType;
    permissions: Permission[];
}