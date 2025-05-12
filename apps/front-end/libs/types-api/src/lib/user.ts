import { IUser } from "@cricket-analysis-monorepo/interfaces";

export interface IGetUserResponse {
  user: IUser;
}

export interface IGetUsersRequest {
  page: number;
  limit: number;
  search: string
}
export interface IGetUsersResponse {
  users: IUser[];
  totalData: number;
}

export interface IGetUserByIdRequest {
  id: string
}
export interface IGetUserByIdResponse {
  user: IUser
}

export interface IUpdateUserResponse {
  user: IUser
}