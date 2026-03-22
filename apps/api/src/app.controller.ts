import { Controller, Get } from '@nestjs/common';
import type { HealthStatus } from '@fixora/types';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): HealthStatus {
    return {
      status: 'ok',
      service: 'fixora-api',
      timestamp: new Date().toISOString(),
    };
  }
}
