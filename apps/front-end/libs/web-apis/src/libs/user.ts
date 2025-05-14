import { IGetUserResponse, IGetUsersRequest, IGetUsersResponse, IGetUserByIdRequest, IGetUserByIdResponse, IUpdateUserResponse } from '@/libs/types-api/src';
import http from './http-common'
import { apiErrorHandler } from '@/libs/utils/apiErrorHandler';
import { IApiResponse, IUser } from '@cricket-analysis-monorepo/interfaces';

export const getUser = async (): Promise<IApiResponse<IGetUserResponse>> => {
  try {
    const result = await http.get<IApiResponse<IGetUserResponse>>('/panel-user');
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
    const result = await http.get<IApiResponse<IGetUsersResponse>>(`/user?${query}`);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "fetching user");
  }
};

export const getUserById = async (params: IGetUserByIdRequest): Promise<IApiResponse<IGetUserByIdResponse>> => {
  try {
    const result = await http.get<IApiResponse<IGetUserByIdResponse>>(`/user/${params.id}`);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "fetching user by id");
  }
};

export const updateUser = async (params: Partial<IUser>): Promise<IApiResponse<IUpdateUserResponse>> => {
  try {
    const { _id, ...otherParams } = params
    const result = await http.patch<IApiResponse<IUpdateUserResponse>>(`/user/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating user");
  }
};


export const createUser = async (params: Partial<IUser>): Promise<IApiResponse<IUser>> => {
  try {
    const result = await http.post<IApiResponse<IUser>>(`/user/create`, params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating user");
  }
};

export const deleteUsers = async (ids: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/user', { data: { ids } });
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete users: ${error}`);
  }
};