import { IGetUserResponse, IGetUsersRequest, IGetUsersResponse, IGetUserByIdRequest, IGetUserByIdResponse, IUpdateUserResponse } from '@/libs/types-api/src';
import http from './http-common'
import { apiErrorHandler } from '@/libs/utils/apiErrorHandler';
import { IApiResponse, IUser } from '@cricket-analysis-monorepo/interfaces';

export const getUserProfile = async (): Promise<IApiResponse<IGetUserResponse>> => {
  try {
    const result = await http.get<IApiResponse<IGetUserResponse>>('/user/profile');
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching user: ${error}`);
  }
};

export const getUsers = async (params: IGetUsersRequest): Promise<IApiResponse<IGetUsersResponse>> => {
  const query = new URLSearchParams();
  query.set('search', params.search.toString());
  query.set('page', params.page.toString());
  query.set('limit', params.limit.toString());

  try {
    const result = await http.get<IApiResponse<IGetUsersResponse>>(`/user-management/users?${query}`);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "fetching user");
  }
};

export const getUserById = async (params: IGetUserByIdRequest): Promise<IApiResponse<IGetUserByIdResponse>> => {
  try {
    const result = await http.get<IApiResponse<IGetUserByIdResponse>>(`/user-management/users/${params.id}`);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "fetching user by id");
  }
};

export const updateUser = async (params: Partial<IUser>): Promise<IApiResponse<IUpdateUserResponse>> => {
  try {
    const { _id, ...otherParams } = params
    const result = await http.patch<IApiResponse<IUpdateUserResponse>>(`/user-management/users/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating user");
  }
};

export const createUser = async (params: Partial<IUser>): Promise<IApiResponse<IUser>> => {
  try {
    const result = await http.post<IApiResponse<IUser>>(`/user-management/users`, params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating user");
  }
};

export const deleteUsers = async (ids: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/user-management/users', { data: { ids } });
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete users: ${error}`);
  }
};