import AuthLayout from '@/components/templates/AuthLayout';
import RegisterForm from '@/components/organisms/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout title="Crear cuenta" subtitle="Registra un usuario administrador">
      <RegisterForm />
    </AuthLayout>
  );
}
