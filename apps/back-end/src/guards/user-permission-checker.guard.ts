
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ROUTE_PERMISSION_KEY_NAME } from '../helper/constant.helper';
import { Permission, UserRoleType } from '@cricket-analysis-monorepo/constants';
import { responseMessage } from '../helper/response-message.helper';

@Injectable()
export class UserPermissionCheckerGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { user } = request.headers;
    const requiredPermissions: Permission[] = await this.reflector.getAllAndOverride(ROUTE_PERMISSION_KEY_NAME, [context.getHandler(), context.getClass()]);

    const isUserValidPermission = user.role.type === UserRoleType.adminstrator || requiredPermissions.some((permission: Permission) => user.role.permissions.includes(permission));

    if (!isUserValidPermission) {
      throw new ForbiddenException(responseMessage.invalidAction);
    }

    return isUserValidPermission;
  }
}