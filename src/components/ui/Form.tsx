import React from 'react';
import { useForm } from '@/hooks/useForm';
import { Input } from './Input';
import { Button } from './Button';
import { Icon } from './Icon';
import { ValidationSchema } from '@/utils/validation';
import { cn } from '@/utils/cn';

interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'checkbox';
  placeholder?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

interface FormProps<T> {
  fields: FormField[];
  initialValues: T;
  validationSchema?: ValidationSchema;
  onSubmit?: (values: T) => void | Promise<void>;
  onError?: (errors: string[]) => void;
  submitText?: string;
  loadingText?: string;
  className?: string;
  showReset?: boolean;
  resetText?: string;
}

export function Form<T extends Record<string, any>>({
  fields,
  initialValues,
  validationSchema,
  onSubmit,
  onError,
  submitText = 'Enviar',
  loadingText = 'Enviando...',
  className,
  showReset = false,
  resetText = 'Resetear'
}: FormProps<T>) {
  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm({
    initialValues,
    validationSchema,
    onSubmit,
    onError
  });

  const renderField = (field: FormField) => {
    const fieldName = field.name as keyof T;
    const fieldValue = values[fieldName];
    const fieldErrors = errors[fieldName];
    const fieldTouched = touched[fieldName];
    const showError = fieldErrors && fieldTouched;

    const commonProps = {
      id: field.name,
      name: field.name,
      value: fieldValue || '',
      onChange: handleChange(fieldName),
      onBlur: handleBlur(fieldName),
      error: showError ? fieldErrors[0] : undefined,
      helperText: field.helperText,
      leftIcon: field.leftIcon,
      rightIcon: field.rightIcon,
      fullWidth: field.fullWidth,
      placeholder: field.placeholder,
      disabled: isSubmitting
    };

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className="space-y-1">
          {field.label && (
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
          )}
          <textarea
            {...commonProps}
            rows={4}
            className={cn(
              'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
              showError && 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500',
              field.fullWidth && 'w-full'
            )}
          />
          {showError && (
            <p className="text-sm text-red-600">{fieldErrors[0]}</p>
          )}
        </div>
      );
    }

    if (field.type === 'checkbox') {
      return (
        <div key={field.name} className="flex items-center space-x-2">
          <input
            {...commonProps}
            type="checkbox"
            checked={fieldValue || false}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {showError && (
            <p className="text-sm text-red-600">{fieldErrors[0]}</p>
          )}
        </div>
      );
    }

    return (
      <Input
        key={field.name}
        label={field.label}
        type={field.type || 'text'}
        {...commonProps}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <div className="space-y-4">
        {fields.map(renderField)}
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <Icon name="error" className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Hay errores en el formulario
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {Object.values(errors).flat().map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          fullWidth
        >
          {isSubmitting ? loadingText : submitText}
        </Button>

        {showReset && (
          <Button
            type="button"
            variant="secondary"
            onClick={reset}
            disabled={isSubmitting}
          >
            {resetText}
          </Button>
        )}
      </div>
    </form>
  );
} 