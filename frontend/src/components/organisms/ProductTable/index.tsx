'use client';

import { useEffect, useState } from 'react';
import {
  IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@/components/atoms/Chip';
import { formatCOP } from '@/lib/format';
import type { Product } from '@/types';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => { setPage(0); }, [products]);

  const paginated = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell align="right">Precio</TableCell>
            <TableCell align="right">Stock</TableCell>
            <TableCell align="right">Mínimo</TableCell>
            <TableCell>Proveedor</TableCell>
            <TableCell align="center">Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((product) => {
            const lowStock = product.stockActual <= product.stockMinimo;
            return (
              <TableRow key={product._id} hover>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.categoria}</TableCell>
                <TableCell align="right">{formatCOP(product.precio)}</TableCell>
                <TableCell align="right">{product.stockActual}</TableCell>
                <TableCell align="right">{product.stockMinimo}</TableCell>
                <TableCell>{product.proveedor}</TableCell>
                <TableCell align="center">
                  {lowStock ? <Chip label="Bajo" color="warning" size="small" /> : <Chip label="OK" color="success" size="small" />}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar"><IconButton onClick={() => onEdit(product)}><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Eliminar"><IconButton color="error" onClick={() => onDelete(product)}><DeleteIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={products.length}
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
