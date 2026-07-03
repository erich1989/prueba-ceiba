'use client';

import { useEffect, useState } from 'react';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import type { Product } from '@/types';

interface ProductFormProps {
  initial?: Partial<Product>;
  categories: string[];
  onSubmit: (payload: Omit<Product, '_id'>) => Promise<void>;
  onCancel: () => void;
}

const emptyForm = {
  nombre: '', sku: '', categoria: '', precio: 0, stockActual: 0, stockMinimo: 1, proveedor: '',
};

export default function ProductForm({ initial, categories, onSubmit, onCancel }: ProductFormProps) {
  const [form, setForm] = useState({ ...emptyForm, ...initial });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ ...emptyForm, ...initial });
  }, [initial]);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        precio: Number(form.precio),
        stockActual: Number(form.stockActual),
        stockMinimo: Number(form.stockMinimo),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}><FormField label="Nombre" value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} required /></Grid>
        <Grid size={{ xs: 12, md: 6 }}><FormField label="SKU" value={form.sku} onChange={(e) => handleChange('sku', e.target.value.toUpperCase())} required disabled={Boolean(initial?._id)} /></Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Categoría</InputLabel>
            <Select label="Categoría" value={form.categoria} onChange={(e) => handleChange('categoria', String(e.target.value))}>
              {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}><FormField label="Proveedor" value={form.proveedor} onChange={(e) => handleChange('proveedor', e.target.value)} required /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><FormField label="Precio" type="number" value={form.precio} onChange={(e) => handleChange('precio', e.target.value)} required /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><FormField label="Stock actual" type="number" value={form.stockActual} onChange={(e) => handleChange('stockActual', e.target.value)} required disabled={Boolean(initial?._id)} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><FormField label="Stock mínimo" type="number" value={form.stockMinimo} onChange={(e) => handleChange('stockMinimo', e.target.value)} required /></Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
        <Button variant="outlined" onClick={onCancel}>Cancelar</Button>
      </Box>
    </Box>
  );
}
