import { Card, CardContent, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  color?: string;
}

export default function StatCard({ title, value, color }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="h4" sx={{ color: color || 'text.primary', mt: 1 }}>{value}</Typography>
      </CardContent>
    </Card>
  );
}
