import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../users/enums/role.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator'
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../iam.constants';
import { PermissionType } from '../permission.type';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextPermissions = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!contextPermissions) {
      return true;
    }
    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];

    return contextPermissions.every((permission) => {
      user.permissions?.includes(permission)
      }
    );
  }
}