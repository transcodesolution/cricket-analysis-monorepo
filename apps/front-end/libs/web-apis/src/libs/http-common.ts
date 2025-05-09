import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosError as OriginalAxiosError } from 'axios';

type AxiosError = { config: { _retry: boolean } } & OriginalAxiosError;

export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
export const NEXT_APP_URL = '/';

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

export const axiosNextServerInstance = axios.create({
  baseURL: NEXT_APP_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

export const setupAxiosInterceptors = () => {
  axiosInstance.interceptors.request.use(
    (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      return request;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
