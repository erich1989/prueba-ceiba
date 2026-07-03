import { apiGet, apiPost } from '@/lib/apiClient';
import type { PurchaseOrder } from '@/types';

export interface CreatePurchaseOrderPayload {
  producto: string;
  cantidadSolicitada: number;
  proveedor?: string;
  alerta?: string;
}

export async function getPurchaseOrders(estado?: string): Promise<PurchaseOrder[]> {
  const params = estado ? { estado } : undefined;
  return apiGet<PurchaseOrder[]>('/purchase-orders', params);
}

export async function createPurchaseOrder(payload: CreatePurchaseOrderPayload): Promise<PurchaseOrder> {
  return apiPost<PurchaseOrder>('/purchase-orders', payload);
}

export async function approvePurchaseOrder(id: string): Promise<PurchaseOrder> {
  return apiPost<PurchaseOrder>(`/purchase-orders/${id}/aprobar`);
}

export async function rejectPurchaseOrder(id: string, motivoRechazo: string): Promise<PurchaseOrder> {
  return apiPost<PurchaseOrder>(`/purchase-orders/${id}/rechazar`, { motivoRechazo });
}

export async function receivePurchaseOrder(id: string): Promise<PurchaseOrder> {
  return apiPost<PurchaseOrder>(`/purchase-orders/${id}/recibir`);
}
