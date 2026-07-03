import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import AlertItem from '@/components/molecules/AlertItem';
import type { Alert } from '@/types';

interface AlertListProps {
  alerts: Alert[];
}

export default function AlertList({ alerts }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">No hay alertas para mostrar.</Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List>
        {alerts.map((alert) => <AlertItem key={alert._id} alert={alert} />)}
      </List>
    </Paper>
  );
}
