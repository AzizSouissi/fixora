import { IsString, MinLength } from 'class-validator';
import type { RefreshRequest } from '@fixora/types';

export class RefreshTokenDto implements RefreshRequest {
  @IsString()
  @MinLength(16)
  refreshToken!: string;
}
