import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { AuthUser, LoginResponse, LogoutResponse } from '@fixora/types';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { TenantGuard } from './guards/tenant.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginResponse> {
    return this.authService.login(body);
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto): Promise<LoginResponse> {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async logout(@CurrentUser() user: AuthUser): Promise<LogoutResponse> {
    return this.authService.logout(user.id, user.tenantId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, TenantGuard)
  me(@CurrentUser() user: AuthUser): AuthUser {
    return user;
  }

  @Get('admin-check')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('owner', 'dispatcher')
  adminCheck(@CurrentUser() user: AuthUser): { ok: true; role: string } {
    return { ok: true, role: user.role };
  }
}
