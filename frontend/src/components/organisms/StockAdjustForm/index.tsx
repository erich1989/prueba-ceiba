'use client';

import { useState } from 'react';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

interface StockAdjustFormProps {
  onSubmit: (payload: { tipo: 'ENTRADA' | 'SALIDA'; cantidad: number; motivo: string }) => Promise<void>;
}

export default function StockAdjustForm({ onSubmit }: StockAdjustFormProps) {
  const [tipo, setTipo] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
  const [cantidad, setCantidad] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ tipo, cantidad: Number(cantidad), motivo });
      setMotivo('');
      setCantidad(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo</InputLabel>
            <Select label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value as 'ENTRADA' | 'SALIDA')}>
              <MenuItem value="ENTRADA">ENTRADA</MenuItem>
              <MenuItem value="SALIDA">SALIDA</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormField label="Cantidad" type="number" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} required slotProps={{ htmlInput: { min: 1 } }} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormField label="Motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} required />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
        {loading ? 'Aplicando...' : 'Ajustar stock'}
      </Button>
    </Box>
  );
}
