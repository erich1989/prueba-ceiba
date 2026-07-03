'use client';

import {
  IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Chip from '@/components/atoms/Chip';
import type { PurchaseOrder } from '@/types';

const estadoColor: Record<PurchaseOrder['estado'], 'default' | 'warning' | 'success' | 'error' | 'info'> = {
  PENDIENTE: 'warning',
  APROBADA: 'info',
  RECHAZADA: 'error',
  RECIBIDA: 'success',
};

interface PurchaseOrderTableProps {
  orders: PurchaseOrder[];
  onApprove: (order: PurchaseOrder) => void;
  onReject: (order: PurchaseOrder) => void;
  onReceive: (order: PurchaseOrder) => void;
}

export default function PurchaseOrderTable({ orders, onApprove, onReject, onReceive }: PurchaseOrderTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>Proveedor</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id} hover>
              <TableCell>{order.producto?.nombre} ({order.producto?.sku})</TableCell>
              <TableCell>{order.proveedor}</TableCell>
              <TableCell align="right">{order.cantidadSolicitada}</TableCell>
              <TableCell><Chip label={order.estado} color={estadoColor[order.estado]} size="small" /></TableCell>
              <TableCell align="center">
                {order.estado === 'PENDIENTE' && (
                  <>
                    <Tooltip title="Aprobar"><IconButton color="success" onClick={() => onApprove(order)}><CheckIcon /></IconButton></Tooltip>
                    <Tooltip title="Rechazar"><IconButton color="error" onClick={() => onReject(order)}><CloseIcon /></IconButton></Tooltip>
                  </>
                )}
                {order.estado === 'APROBADA' && (
                  <Tooltip title="Recibir"><IconButton color="primary" onClick={() => onReceive(order)}><LocalShippingIcon /></IconButton></Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
