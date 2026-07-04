'use client';

import { useEffect, useState } from 'react';
import {
  IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Tooltip,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => { setPage(0); }, [orders]);

  const paginated = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          {paginated.map((order) => (
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
      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </TableContainer>
  );
}
