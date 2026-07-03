import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

export interface ProductFilterValues {
  categoria: string;
  proveedor: string;
  stockMin: string;
  stockMax: string;
  conAlertaActiva: boolean;
}

interface FilterBarProps {
  values: ProductFilterValues;
  categories: string[];
  onChange: (values: ProductFilterValues) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function FilterBar({ values, categories, onChange, onApply, onClear }: FilterBarProps) {
  const update = (field: keyof ProductFilterValues, value: string | boolean) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Categoría</InputLabel>
          <Select label="Categoría" value={values.categoria} onChange={(e) => update('categoria', String(e.target.value))}>
            <MenuItem value="">Todas</MenuItem>
            {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormField label="Proveedor" value={values.proveedor} onChange={(e) => update('proveedor', e.target.value)} />
      </Grid>
      <Grid size={{ xs: 6, md: 2 }}>
        <FormField label="Stock mín." type="number" value={values.stockMin} onChange={(e) => update('stockMin', e.target.value)} />
      </Grid>
      <Grid size={{ xs: 6, md: 2 }}>
        <FormField label="Stock máx." type="number" value={values.stockMax} onChange={(e) => update('stockMax', e.target.value)} />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={onApply}>Filtrar</Button>
          <Button variant="outlined" onClick={onClear}>Limpiar</Button>
        </Box>
      </Grid>
    </Grid>
  );
}
