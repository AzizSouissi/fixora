export interface HealthStatus {
  status: 'ok' | 'error';
  service: string;
  timestamp: string;
}
