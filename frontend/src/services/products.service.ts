import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/apiClient';
import type { Product, ProductFilters } from '@/types';

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const params: Record<string, string> = {};
  if (filters?.categoria) params.categoria = filters.categoria;
  if (filters?.proveedor) params.proveedor = filters.proveedor;
  if (filters?.stockMin) params.stockMin = filters.stockMin;
  if (filters?.stockMax) params.stockMax = filters.stockMax;
  if (filters?.conAlertaActiva) params.conAlertaActiva = 'true';
  return apiGet<Product[]>('/products', params);
}

export async function getProduct(id: string): Promise<Product> {
  return apiGet<Product>(`/products/${id}`);
}

export async function createProduct(payload: Omit<Product, '_id'>): Promise<Product> {
  return apiPost<Product>('/products', payload);
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  return apiPut<Product>(`/products/${id}`, payload);
}

export async function deleteProduct(id: string): Promise<Product> {
  return apiDelete<Product>(`/products/${id}`);
}

export async function getCategories(): Promise<string[]> {
  return apiGet<string[]>('/categories');
}
