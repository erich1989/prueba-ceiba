'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractApiError } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RegisterForm() {
  const { register } = useAuth();
  const { showError } = useSnackbar();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(nombre, email, password);
      window.location.href = '/products';
    } catch (error) {
      showError(extractApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <FormField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <FormField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </Button>
      <Button component={Link} href="/login" fullWidth sx={{ mt: 1 }}>
        Ya tengo cuenta
      </Button>
    </Box>
  );
}
