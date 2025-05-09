import { IUserRole } from "./user-role";

export interface IUser {
    _id?: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    roleId: string;
    role: IUserRole;
    profileImage: string;
}