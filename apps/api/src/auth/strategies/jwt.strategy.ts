import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AuthUser } from '@fixora/types';
import { AuthService } from '../auth.service';

type JwtPayload = {
  sub: string;
  tenantId: string;
  email: string;
  name: string;
  role: 'owner' | 'dispatcher' | 'technician';
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET ?? 'fixora-dev-access-secret',
    });
  }

  validate(payload: JwtPayload): Promise<AuthUser> {
    return this.authService.validateJwtPayload(payload);
  }
}
