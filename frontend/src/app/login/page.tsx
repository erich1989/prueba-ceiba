import AuthLayout from '@/components/templates/AuthLayout';
import LoginForm from '@/components/organisms/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout title="Iniciar sesión" subtitle="Accede al panel de inventario">
      <LoginForm />
    </AuthLayout>
  );
}
