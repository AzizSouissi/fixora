import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';

type MockUser = {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: 'owner' | 'dispatcher' | 'technician';
  passwordHash: string;
  refreshTokenHash?: string | null;
  save: jest.Mock<Promise<void>, []>;
};

describe('AuthService', () => {
  let service: AuthService;
  const users: MockUser[] = [];

  const userModel = {
    findOne: jest.fn((filter: Record<string, string>) => ({
      exec: jest.fn(() =>
        Promise.resolve(
          users.find((user) => {
            if (filter._id && user.id !== filter._id) {
              return false;
            }
            if (filter.tenantId && user.tenantId !== filter.tenantId) {
              return false;
            }
            if (filter.email && user.email !== filter.email) {
              return false;
            }
            return true;
          }) ?? null,
        ),
      ),
    })),
    find: jest.fn((filter: Record<string, string>) => ({
      exec: jest.fn(() =>
        Promise.resolve(
          users.filter((user) => user.tenantId === filter.tenantId),
        ),
      ),
    })),
    countDocuments: jest.fn((filter: Record<string, string>) => ({
      exec: jest.fn(() =>
        Promise.resolve(
          users.filter((user) => user.tenantId === filter.tenantId).length,
        ),
      ),
    })),
    create: jest.fn(
      (payload: Omit<MockUser, 'save' | 'id'> & { id?: string }) => {
        const created: MockUser = {
          ...payload,
          id: payload.id ?? `${payload.tenantId}:${payload.email}`,
          save: jest.fn(() => Promise.resolve()),
        };
        users.push(created);
        return Promise.resolve(created);
      },
    ),
  };

  beforeEach(async () => {
    users.length = 0;
    jest.clearAllMocks();
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_ACCESS_SECRET,
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('logs in a seeded tenant user', async () => {
    const result = await service.login({
      tenantId: 'tenant-acme',
      email: 'owner@acme.fixora.local',
      password: 'Passw0rd!',
    });

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.user.tenantId).toBe('tenant-acme');
    expect(result.user.role).toBe('owner');
  });

  it('rejects cross-tenant credentials', async () => {
    await expect(
      service.login({
        tenantId: 'tenant-zen',
        email: 'owner@acme.fixora.local',
        password: 'Passw0rd!',
      }),
    ).rejects.toThrow('Invalid credentials');
  });

  it('returns tenant users from Mongo model', async () => {
    const tenantUsers = await service.getTenantUsers('tenant-acme');
    expect(tenantUsers.length).toBeGreaterThan(0);
    expect(tenantUsers.every((entry) => entry.tenantId === 'tenant-acme')).toBe(
      true,
    );
  });

  it('revokes refresh token on logout', async () => {
    const loginResult = await service.login({
      tenantId: 'tenant-acme',
      email: 'owner@acme.fixora.local',
      password: 'Passw0rd!',
    });

    const logoutResult = await service.logout(
      loginResult.user.id,
      loginResult.user.tenantId,
    );

    expect(logoutResult.success).toBe(true);

    await expect(service.refresh(loginResult.refreshToken)).rejects.toThrow(
      'Refresh token is not active',
    );
  });
});
