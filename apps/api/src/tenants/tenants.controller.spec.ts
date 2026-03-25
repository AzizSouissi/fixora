import { Test, TestingModule } from '@nestjs/testing';
import { TenantsController } from './tenants.controller';
import { AuthService } from '../auth/auth.service';

describe('TenantsController', () => {
  let controller: TenantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getTenantProfile: jest.fn(),
            getTenantUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TenantsController>(TenantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
