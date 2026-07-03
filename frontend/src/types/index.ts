export interface User {
  id: string;
  nombre: string;
  email: string;
  role: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface Product {
  _id: string;
  nombre: string;
  sku: string;
  categoria: string;
  precio: number;
  stockActual: number;
  stockMinimo: number;
  proveedor: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryMovement {
  _id: string;
  producto: string;
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  fecha: string;
  motivo: string;
  createdAt?: string;
}

export interface Alert {
  _id: string;
  producto: Product;
  tipo: 'STOCK_BAJO';
  estado: 'ACTIVA' | 'RESUELTA';
  resueltaEn: string | null;
  createdAt?: string;
}

export interface PurchaseOrder {
  _id: string;
  producto: Product;
  proveedor: string;
  cantidadSolicitada: number;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'RECIBIDA';
  motivoRechazo?: string | null;
  alerta?: string | null;
  createdAt?: string;
}

export interface ProductFilters {
  categoria?: string;
  proveedor?: string;
  stockMin?: string;
  stockMax?: string;
  conAlertaActiva?: boolean;
}

export interface ApiEnvelope<T> {
  status: number;
  error: string;
  response: T;
}
