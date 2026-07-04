'use client';

import {
  IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip,
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
          {products.map((product) => {
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
    </TableContainer>
  );
}
