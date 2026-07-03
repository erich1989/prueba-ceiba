'use client';

import { useState } from 'react';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import type { Product } from '@/types';

interface PurchaseOrderFormProps {
  products: Product[];
  onSubmit: (payload: { producto: string; cantidadSolicitada: number; proveedor?: string }) => Promise<void>;
}

export default function PurchaseOrderForm({ products, onSubmit }: PurchaseOrderFormProps) {
  const [producto, setProducto] = useState('');
  const [cantidadSolicitada, setCantidadSolicitada] = useState(1);
  const [proveedor, setProveedor] = useState('');
  const [loading, setLoading] = useState(false);

  const selected = products.find((p) => p._id === producto);
  const minQty = selected ? selected.stockMinimo * 2 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        producto,
        cantidadSolicitada: Number(cantidadSolicitada),
        proveedor: proveedor || selected?.proveedor,
      });
      setCantidadSolicitada(minQty || 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Producto</InputLabel>
            <Select
              label="Producto"
              value={producto}
              onChange={(e) => {
                const value = String(e.target.value);
                setProducto(value);
                const p = products.find((item) => item._id === value);
                if (p) {
                  setProveedor(p.proveedor);
                  setCantidadSolicitada(p.stockMinimo * 2);
                }
              }}
            >
              <MenuItem value="">Seleccionar...</MenuItem>
              {products.map((p) => <MenuItem key={p._id} value={p._id}>{p.nombre} ({p.sku})</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormField label="Cantidad solicitada" type="number" value={cantidadSolicitada} onChange={(e) => setCantidadSolicitada(Number(e.target.value))} required helperText={minQty ? `Mínimo: ${minQty}` : ''} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormField label="Proveedor" value={proveedor} onChange={(e) => setProveedor(e.target.value)} required />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading || !producto}>
        {loading ? 'Creando...' : 'Crear orden'}
      </Button>
    </Box>
  );
}
