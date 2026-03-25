import { IsEmail, IsString, MinLength } from 'class-validator';
import type { LoginRequest } from '@fixora/types';

export class LoginDto implements LoginRequest {
  @IsString()
  @MinLength(3)
  tenantId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
