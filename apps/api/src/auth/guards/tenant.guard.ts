import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { AuthUser } from '@fixora/types';

type RequestWithTenant = {
  user?: AuthUser;
  headers: Record<string, string | string[] | undefined>;
  params: Record<string, string | undefined>;
  body?: { tenantId?: string };
  query?: Record<string, unknown>;
};

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithTenant>();
    const user = request.user;
    if (!user) {
      return false;
    }

    const headerTenantId = request.headers['x-tenant-id'];
    const tenantFromHeader = Array.isArray(headerTenantId)
      ? headerTenantId[0]
      : headerTenantId;
    const tenantFromParams = request.params.tenantId;
    const tenantFromBody = request.body?.tenantId;
    const tenantFromQuery =
      typeof request.query?.tenantId === 'string'
        ? request.query.tenantId
        : undefined;

    const assertedTenantId =
      tenantFromParams ?? tenantFromBody ?? tenantFromQuery ?? tenantFromHeader;

    if (assertedTenantId && assertedTenantId !== user.tenantId) {
      throw new ForbiddenException('Cross-tenant access denied');
    }

    return true;
  }
}
