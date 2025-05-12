import { IUser } from "@cricket-analysis-monorepo/interfaces";

export interface ISignInRequest {
  email: string;
  password: string;
}

export interface ISignInResponse {
  statusCode: number,
  message: string,
  data: IUser & { token: string }
}