import { IGetRolesRequest } from "@/libs/types-api/src";
import http from "./http-common";
import { apiErrorHandler } from "@/libs/utils/apiErrorHandler";
import { IApiResponse, IUserRole, PaginationApiResponseType } from "@cricket-analysis-monorepo/interfaces";

export const getRoles = async (params: IGetRolesRequest): Promise<IApiResponse<PaginationApiResponseType<IUserRole[]>>> => {
  try {
    const result = await http.get<IApiResponse<PaginationApiResponseType<IUserRole[]>>>('/user-role?', { params });
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching roles: ${error}`);
  }
};

export const getRoleById = async (roleId: string): Promise<IApiResponse<IUserRole>> => {
  try {
    const result = await http.get<IApiResponse<IUserRole>>(`/user-role/${roleId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error while fetching role by ID: ${error}`);
  }
};

export const createRole = async (params: Partial<IUserRole>): Promise<IApiResponse<IUserRole>> => {
  try {
    const result = await http.post<IApiResponse<IUserRole>>('/user-role/create', params);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "creating role");
  }
};

export const updateRole = async (params: Partial<IUserRole>): Promise<IApiResponse<IUserRole>> => {
  try {
    const { _id, ...otherParams } = params;
    const result = await http.patch<IApiResponse<IUserRole>>(`/user-role/${_id}`, otherParams);
    return result.data;
  } catch (error) {
    return apiErrorHandler(error, "updating role");
  }
};

export const deleteRoles = async (roleIds: string[]): Promise<IApiResponse> => {
  try {
    const result = await http.delete<IApiResponse>('/user-role', { data: { roleIds } });
    return result.data;
  } catch (error) {
    throw new Error(`Error while delete role: ${error}`);
  }
};