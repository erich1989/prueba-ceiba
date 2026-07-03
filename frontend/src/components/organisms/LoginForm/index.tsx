'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractApiError } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginForm() {
  const { login } = useAuth();
  const { showError } = useSnackbar();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      window.location.href = '/products';
    } catch (error) {
      showError(extractApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <FormField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </Button>
      <Button component={Link} href="/register" fullWidth sx={{ mt: 1 }}>
        Crear cuenta
      </Button>
    </Box>
  );
}
