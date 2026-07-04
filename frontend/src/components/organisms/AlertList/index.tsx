'use client';

import { useEffect, useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Typography,
} from '@mui/material';
import Chip from '@/components/atoms/Chip';
import type { Alert } from '@/types';

interface AlertListProps {
  alerts: Alert[];
}

export default function AlertList({ alerts }: AlertListProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => { setPage(0); }, [alerts]);

  if (alerts.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">No hay alertas para mostrar.</Typography>
      </Paper>
    );
  }

  const paginated = alerts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell align="right">Stock</TableCell>
            <TableCell align="right">Mínimo</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell align="center">Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((alert) => {
            const product = alert.producto;
            return (
              <TableRow key={alert._id} hover>
                <TableCell>{product?.nombre || 'Producto'}</TableCell>
                <TableCell>{product?.sku || ''}</TableCell>
                <TableCell align="right">{product?.stockActual}</TableCell>
                <TableCell align="right">{product?.stockMinimo}</TableCell>
                <TableCell>{alert.tipo}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={alert.estado}
                    color={alert.estado === 'ACTIVA' ? 'warning' : 'success'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={alerts.length}
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
