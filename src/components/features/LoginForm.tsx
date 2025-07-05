import React from 'react';
import { Form } from '@/components/ui/Form';
import { Icon } from '@/components/ui/Icon';
import { validationSchemas } from '@/utils/validation';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void | Promise<void>;
  onError?: (errors: string[]) => void;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onError,
  loading = false
}) => {
  const fields = [
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email' as const,
      placeholder: 'tu@email.com',
      leftIcon: <Icon name="search" />,
      fullWidth: true
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password' as const,
      placeholder: '••••••••',
      fullWidth: true
    },
    {
      name: 'rememberMe',
      label: 'Recordarme',
      type: 'checkbox' as const
    }
  ];

  const initialValues: LoginFormData = {
    email: '',
    password: '',
    rememberMe: false
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
        <p className="mt-2 text-sm text-gray-600">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <Form
        fields={fields}
        initialValues={initialValues}
        validationSchema={validationSchemas.login}
        onSubmit={onSubmit}
        onError={onError}
        submitText="Iniciar sesión"
        loadingText="Iniciando sesión..."
        className="space-y-6"
      />
    </div>
  );
}; 