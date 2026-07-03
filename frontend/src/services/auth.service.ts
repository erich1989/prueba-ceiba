import { apiPost } from '@/lib/apiClient';
import type { AuthSession, User } from '@/types';

export async function login(email: string, password: string): Promise<AuthSession> {
  return apiPost<AuthSession>('/users/login', { email, password });
}

export async function register(nombre: string, email: string, password: string): Promise<User> {
  return apiPost<User>('/users/register', { nombre, email, password });
}
