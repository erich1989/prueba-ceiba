import { apiGet, apiPost } from '@/lib/apiClient';
import type { InventoryMovement, Product } from '@/types';

export interface StockAdjustPayload {
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  motivo: string;
}

export interface StockAdjustResult {
  producto: Product;
  movimiento: InventoryMovement;
}

export async function adjustStock(productId: string, payload: StockAdjustPayload): Promise<StockAdjustResult> {
  return apiPost<StockAdjustResult>(`/products/${productId}/ajustar`, payload);
}

export async function getMovements(productId: string): Promise<InventoryMovement[]> {
  return apiGet<InventoryMovement[]>(`/products/${productId}/movimientos`);
}
