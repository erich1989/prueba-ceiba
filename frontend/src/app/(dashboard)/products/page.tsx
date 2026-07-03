'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, FormControlLabel, Switch } from '@mui/material';
import Title from '@/components/atoms/Title';
import Loader from '@/components/atoms/Loader';
import Button from '@/components/atoms/Button';
import ProductTable from '@/components/organisms/ProductTable';
import ProductForm from '@/components/organisms/ProductForm';
import FilterBar, { ProductFilterValues } from '@/components/molecules/FilterBar';
import ConfirmDialog from '@/components/molecules/ConfirmDialog';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractApiError } from '@/lib/apiClient';
import * as productsService from '@/services/products.service';
import type { Product } from '@/types';

const emptyFilters: ProductFilterValues = {
  categoria: '', proveedor: '', stockMin: '', stockMax: '', conAlertaActiva: false,
};

export default function ProductsPage() {
  const { showSuccess, showError } = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProductFilterValues>(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [items, cats] = await Promise.all([
        productsService.getProducts({
          categoria: filters.categoria || undefined,
          proveedor: filters.proveedor || undefined,
          stockMin: filters.stockMin || undefined,
          stockMax: filters.stockMax || undefined,
          conAlertaActiva: filters.conAlertaActiva || undefined,
        }),
        productsService.getCategories(),
      ]);
      setProducts(items);
      setCategories(cats);
    } catch (error) {
      showError(extractApiError(error));
    } finally {
      setLoading(false);
    }
  }, [filters, showError]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (payload: Omit<Product, '_id'>) => {
    try {
      if (editing) {
        await productsService.updateProduct(editing._id, payload);
        showSuccess('Producto actualizado');
      } else {
        await productsService.createProduct(payload);
        showSuccess('Producto creado');
      }
      setDialogOpen(false);
      setEditing(null);
      await loadData();
    } catch (error) {
      showError(extractApiError(error));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await productsService.deleteProduct(deleteTarget._id);
      showSuccess('Producto eliminado');
      setDeleteTarget(null);
      await loadData();
    } catch (error) {
      showError(extractApiError(error));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Title>Productos</Title>
        <Button variant="contained" onClick={() => { setEditing(null); setDialogOpen(true); }}>Nuevo producto</Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <FilterBar
          values={filters}
          categories={categories}
          onChange={setFilters}
          onApply={loadData}
          onClear={() => { setFilters(emptyFilters); }}
        />
        <FormControlLabel
          control={<Switch checked={filters.conAlertaActiva} onChange={(e) => setFilters({ ...filters, conAlertaActiva: e.target.checked })} />}
          label="Solo con alerta activa"
          sx={{ mt: 1 }}
        />
      </Box>

      {loading ? <Loader /> : <ProductTable products={products} onEdit={(p) => { setEditing(p); setDialogOpen(true); }} onDelete={setDeleteTarget} />}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
        <DialogContent>
          <ProductForm initial={editing || undefined} categories={categories} onSubmit={handleSave} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar producto"
        message={`¿Eliminar ${deleteTarget?.nombre}?`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
