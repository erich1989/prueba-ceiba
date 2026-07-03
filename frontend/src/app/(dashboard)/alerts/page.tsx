'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Title from '@/components/atoms/Title';
import Loader from '@/components/atoms/Loader';
import AlertList from '@/components/organisms/AlertList';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractApiError } from '@/lib/apiClient';
import * as alertsService from '@/services/alerts.service';
import type { Alert } from '@/types';

export default function AlertsPage() {
  const { showError } = useSnackbar();
  const [estado, setEstado] = useState<'ACTIVA' | 'RESUELTA'>('ACTIVA');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await alertsService.getAlerts(estado);
      setAlerts(data);
    } catch (error) {
      showError(extractApiError(error));
    } finally {
      setLoading(false);
    }
  }, [estado, showError]);

  useEffect(() => { loadAlerts(); }, [loadAlerts]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Title>Alertas de stock</Title>
        <ToggleButtonGroup exclusive value={estado} onChange={(_, value) => value && setEstado(value)}>
          <ToggleButton value="ACTIVA">Activas</ToggleButton>
          <ToggleButton value="RESUELTA">Resueltas</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {loading ? <Loader /> : <AlertList alerts={alerts} />}
    </Box>
  );
}
