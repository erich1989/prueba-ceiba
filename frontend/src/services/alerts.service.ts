import { apiGet } from '@/lib/apiClient';
import type { Alert } from '@/types';

export async function getAlerts(estado?: 'ACTIVA' | 'RESUELTA'): Promise<Alert[]> {
  const params = estado ? { estado } : undefined;
  return apiGet<Alert[]>('/alerts', params);
}
