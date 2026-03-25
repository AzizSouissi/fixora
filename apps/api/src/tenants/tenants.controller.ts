import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import type { AuthUser } from '@fixora/types';
import { AuthService } from '../auth/auth.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('tenants')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class TenantsController {
  constructor(private readonly authService: AuthService) {}

  @Get(':tenantId/profile')
  async getTenantProfile(@Param('tenantId') tenantId: string): Promise<{
    id: string;
    users: number;
  }> {
    return this.authService.getTenantProfile(tenantId);
  }

  @Get(':tenantId/users')
  @Roles('owner', 'dispatcher')
  async getTenantUsers(
    @Param('tenantId') tenantId: string,
  ): Promise<AuthUser[]> {
    return this.authService.getTenantUsers(tenantId);
  }
}
