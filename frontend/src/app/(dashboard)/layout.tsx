'use client';

import ProtectedRoute from '@/components/guards/ProtectedRoute';
import DashboardLayout from '@/components/templates/DashboardLayout';

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
