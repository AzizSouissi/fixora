import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { Model } from 'mongoose';
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  UserRole,
} from '@fixora/types';
import { User, type UserDocument } from './schemas/user.schema';

type AccessTokenPayload = {
  sub: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
};

type RefreshTokenPayload = {
  sub: string;
  tenantId: string;
  jti: string;
};

const SEED_USERS: Array<Omit<AuthUser, 'id'> & { password: string }> = [
  {
    tenantId: 'tenant-acme',
    email: 'owner@acme.fixora.local',
    name: 'Ava Owner',
    role: 'owner',
    password: 'Passw0rd!',
  },
  {
    tenantId: 'tenant-acme',
    email: 'dispatch@acme.fixora.local',
    name: 'Dylan Dispatch',
    role: 'dispatcher',
    password: 'Passw0rd!',
  },
  {
    tenantId: 'tenant-zen',
    email: 'tech@zen.fixora.local',
    name: 'Taylor Tech',
    role: 'technician',
    password: 'Passw0rd!',
  },
];

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedUsersIfMissing();
  }

  async login(body: LoginRequest): Promise<LoginResponse> {
    const user = await this.validateCredentials(body);
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string): Promise<LoginResponse> {
    let payload: RefreshTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          secret: this.getRefreshSecret(),
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userModel
      .findOne({ _id: payload.sub, tenantId: payload.tenantId })
      .exec();

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token is not active');
    }

    const isTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );
    if (!isTokenMatch) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    return this.issueTokens(user);
  }

  async logout(userId: string, tenantId: string): Promise<LogoutResponse> {
    const user = await this.userModel.findOne({ _id: userId, tenantId }).exec();
    if (!user) {
      throw new UnauthorizedException('User not found for logout');
    }

    user.refreshTokenHash = null;
    await user.save();

    return { success: true };
  }

  async validateJwtPayload(payload: AccessTokenPayload): Promise<AuthUser> {
    const user = await this.userModel
      .findOne({ _id: payload.sub, tenantId: payload.tenantId })
      .exec();
    if (!user) {
      throw new UnauthorizedException('User in token no longer exists');
    }
    return this.toAuthUser(user);
  }

  async getTenantUsers(tenantId: string): Promise<AuthUser[]> {
    const users = await this.userModel.find({ tenantId }).exec();
    return users.map((user) => this.toAuthUser(user));
  }

  async getTenantProfile(
    tenantId: string,
  ): Promise<{ id: string; users: number }> {
    const users = await this.userModel.countDocuments({ tenantId }).exec();
    if (users === 0) {
      throw new NotFoundException('Tenant not found');
    }

    return {
      id: tenantId,
      users,
    };
  }

  private async validateCredentials(body: LoginRequest): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ tenantId: body.tenantId, email: body.email.toLowerCase() })
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private async issueTokens(user: UserDocument): Promise<LoginResponse> {
    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      jti: randomUUID(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.getRefreshSecret(),
        expiresIn: '7d',
      }),
    ]);

    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: this.toAuthUser(user),
    };
  }

  private toAuthUser(user: UserDocument): AuthUser {
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  private async seedUsersIfMissing(): Promise<void> {
    for (const seed of SEED_USERS) {
      const existingUser = await this.userModel
        .findOne({ tenantId: seed.tenantId, email: seed.email.toLowerCase() })
        .exec();

      if (existingUser) {
        continue;
      }

      const passwordHash = await bcrypt.hash(seed.password, 10);
      await this.userModel.create({
        tenantId: seed.tenantId,
        email: seed.email.toLowerCase(),
        name: seed.name,
        role: seed.role,
        passwordHash,
        refreshTokenHash: null,
      });
    }
  }

  private getRefreshSecret(): string {
    return process.env.JWT_REFRESH_SECRET ?? 'fixora-dev-refresh-secret';
  }
}
