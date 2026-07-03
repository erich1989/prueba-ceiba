'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import Title from '@/components/atoms/Title';
import Loader from '@/components/atoms/Loader';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import PurchaseOrderTable from '@/components/organisms/PurchaseOrderTable';
import PurchaseOrderForm from '@/components/organisms/PurchaseOrderForm';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractApiError } from '@/lib/apiClient';
import * as productsService from '@/services/products.service';
import * as purchaseOrdersService from '@/services/purchaseOrders.service';
import type { Product, PurchaseOrder } from '@/types';

export default function PurchaseOrdersPage() {
  const { showSuccess, showError } = useSnackbar();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectOrder, setRejectOrder] = useState<PurchaseOrder | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [orderList, productList] = await Promise.all([
        purchaseOrdersService.getPurchaseOrders(),
        productsService.getProducts(),
      ]);
      setOrders(orderList);
      setProducts(productList);
    } catch (error) {
      showError(extractApiError(error));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async (payload: { producto: string; cantidadSolicitada: number; proveedor?: string }) => {
    try {
      await purchaseOrdersService.createPurchaseOrder(payload);
      showSuccess('Orden de compra creada');
      await loadData();
    } catch (error) {
      showError(extractApiError(error));
    }
  };

  const handleApprove = async (order: PurchaseOrder) => {
    try {
      await purchaseOrdersService.approvePurchaseOrder(order._id);
      showSuccess('Orden aprobada');
      await loadData();
    } catch (error) {
      showError(extractApiError(error));
    }
  };

  const handleReject = async () => {
    if (!rejectOrder) return;
    try {
      await purchaseOrdersService.rejectPurchaseOrder(rejectOrder._id, motivoRechazo);
      showSuccess('Orden rechazada');
      setRejectOrder(null);
      setMotivoRechazo('');
      await loadData();
    } catch (error) {
      showError(extractApiError(error));
    }
  };

  const handleReceive = async (order: PurchaseOrder) => {
    try {
      await purchaseOrdersService.receivePurchaseOrder(order._id);
      showSuccess('Orden recibida e inventario actualizado');
      await loadData();
    } catch (error) {
      showError(extractApiError(error));
    }
  };

  return (
    <Box>
      <Title>Órdenes de compra</Title>
      <Box sx={{ mb: 3 }}>
        <PurchaseOrderForm products={products} onSubmit={handleCreate} />
      </Box>
      {loading ? <Loader /> : (
        <PurchaseOrderTable
          orders={orders}
          onApprove={handleApprove}
          onReject={setRejectOrder}
          onReceive={handleReceive}
        />
      )}

      <Dialog open={Boolean(rejectOrder)} onClose={() => setRejectOrder(null)}>
        <DialogTitle>Rechazar orden</DialogTitle>
        <DialogContent>
          <FormField
            label="Motivo de rechazo (mín. 10 caracteres)"
            value={motivoRechazo}
            onChange={(e) => setMotivoRechazo(e.target.value)}
            multiline rows={3}
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="contained" color="error" onClick={handleReject} disabled={motivoRechazo.length < 10}>
              Rechazar
            </Button>
            <Button variant="outlined" onClick={() => setRejectOrder(null)}>Cancelar</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
