import { ListItem, ListItemText } from '@mui/material';
import Chip from '@/components/atoms/Chip';
import type { Alert } from '@/types';

interface AlertItemProps {
  alert: Alert;
}

export default function AlertItem({ alert }: AlertItemProps) {
  const product = alert.producto;
  return (
    <ListItem divider>
      <ListItemText
        primary={`${product?.nombre || 'Producto'} (${product?.sku || ''})`}
        secondary={`Stock: ${product?.stockActual} / Mínimo: ${product?.stockMinimo} · ${alert.tipo}`}
      />
      <Chip
        label={alert.estado}
        color={alert.estado === 'ACTIVA' ? 'warning' : 'success'}
        size="small"
      />
    </ListItem>
  );
}
