
import { IUser } from '@cricket-analysis-monorepo/interfaces';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { AuthenticateUserRequest } from '../helper/jwt.helper';

declare module "express" {
  interface Request {
    headers: IncomingHttpHeaders & {
      user: IUser;
    };
    id: string;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authenticateUserRequest: AuthenticateUserRequest) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { success, message, data } = await this.authenticateUserRequest.JWT(request.headers.authorization);
    if (!success) {
      throw new UnauthorizedException(message);
    }
    request.headers.user = data as unknown as IUser;
    return success;
  }
}