'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Title from '@/components/atoms/Title';
import Loader from '@/components/atoms/Loader';
import FormField from '@/components/molecules/FormField';
import StockAdjustForm from '@/components/organisms/StockAdjustForm';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractApiError } from '@/lib/apiClient';
import * as productsService from '@/services/products.service';
import * as inventoryService from '@/services/inventory.service';
import type { InventoryMovement, Product } from '@/types';

export default function InventoryPage() {
  const { showSuccess, showError } = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);

  const selected = products.find((p) => p._id === selectedId);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const items = await productsService.getProducts();
      setProducts(items);
      if (!selectedId && items.length) setSelectedId(items[0]._id);
    } catch (error) {
      showError(extractApiError(error));
    } finally {
      setLoading(false);
    }
  }, [selectedId, showError]);

  const loadMovements = useCallback(async (productId: string) => {
    try {
      const data = await inventoryService.getMovements(productId);
      setMovements(data);
    } catch (error) {
      showError(extractApiError(error));
    }
  }, [showError]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    if (selectedId) loadMovements(selectedId);
  }, [selectedId, loadMovements]);

  const handleAdjust = async (payload: { tipo: 'ENTRADA' | 'SALIDA'; cantidad: number; motivo: string }) => {
    if (!selectedId) return;
    try {
      await inventoryService.adjustStock(selectedId, payload);
      showSuccess('Stock ajustado correctamente');
      await loadProducts();
      await loadMovements(selectedId);
    } catch (error) {
      showError(extractApiError(error));
    }
  };

  if (loading) return <Loader />;

  return (
    <Box>
      <Title>Inventario</Title>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Producto</InputLabel>
            <Select label="Producto" value={selectedId} onChange={(e) => setSelectedId(String(e.target.value))}>
              {products.map((p) => <MenuItem key={p._id} value={p._id}>{p.nombre} ({p.sku})</MenuItem>)}
            </Select>
          </FormControl>
          {selected && (
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="body2">Stock actual: <strong>{selected.stockActual}</strong></Typography>
              <Typography variant="body2">Stock mínimo: <strong>{selected.stockMinimo}</strong></Typography>
            </Paper>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Ajustar stock</Typography>
            <StockAdjustForm onSubmit={handleAdjust} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Historial de movimientos</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell>Motivo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movements.map((m) => (
                  <TableRow key={m._id}>
                    <TableCell>{new Date(m.fecha).toLocaleString()}</TableCell>
                    <TableCell>{m.tipo}</TableCell>
                    <TableCell align="right">{m.cantidad}</TableCell>
                    <TableCell>{m.motivo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
