import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PolicyHandlerStorage } from '../policies/policy-handlers.storage';
import { Policy } from '../policies/interfaces/policy.interface';
import { POLICIES_KEY } from '../decorators/policies.decorator';
import { REQUEST_USER_KEY } from '../../iam.constants';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector,
    private readonly policyHandlerStorage: PolicyHandlerStorage,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policies = this.reflector.getAllAndOverride<Policy[]>(POLICIES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (policies) {
      const user: ActiveUserData = context.switchToHttp().getRequest()[
        REQUEST_USER_KEY
      ];
      await Promise.all(
        policies.map((policy) => {
          const policyHandler = this.policyHandlerStorage.get(
            policy.constructor as Type,
          );
          return policyHandler.handle(policy, user);
        }),
      ).catch((err) => {
        throw new ForbiddenException(err.message);
      })
    }
    return true;
  }
}