import { useState, useCallback, useEffect } from 'react';
import { ValidationSchema, validateForm, ValidationResult } from '@/utils/validation';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ValidationSchema;
  onSubmit?: (values: T) => void | Promise<void>;
  onError?: (errors: string[]) => void;
}

interface UseFormReturn<T> {
  values: T;
  errors: { [K in keyof T]?: string[] };
  touched: { [K in keyof T]?: boolean };
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  handleChange: (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (event?: React.FormEvent) => void;
  reset: () => void;
  validateField: (field: keyof T) => ValidationResult;
  validateForm: () => ValidationResult;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  onError
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{ [K in keyof T]?: string[] }>({});
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar un campo específico
  const validateField = useCallback((field: keyof T): ValidationResult => {
    if (!validationSchema || !validationSchema[field as string]) {
      return { isValid: true, errors: [] };
    }

    const fieldValue = values[field];
    const fieldRules = validationSchema[field as string];
    
    // Importar la función validateField del sistema de validación
    const { validateField: validateFieldUtil } = require('@/utils/validation');
    return validateFieldUtil(fieldValue, fieldRules);
  }, [values, validationSchema]);

  // Validar todo el formulario
  const validateFormData = useCallback((): ValidationResult => {
    if (!validationSchema) {
      return { isValid: true, errors: [] };
    }

    const { validateForm: validateFormUtil } = require('@/utils/validation');
    return validateFormUtil(values, validationSchema);
  }, [values, validationSchema]);

  // Actualizar errores cuando cambian los valores
  useEffect(() => {
    if (!validationSchema) return;

    const newErrors: { [K in keyof T]?: string[] } = {};
    let hasErrors = false;

    for (const field of Object.keys(validationSchema) as (keyof T)[]) {
      const fieldValidation = validateField(field);
      if (!fieldValidation.isValid) {
        newErrors[field] = fieldValidation.errors;
        hasErrors = true;
      }
    }

    setErrors(newErrors);
  }, [values, validationSchema, validateField]);

  // Establecer valor de un campo
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  // Establecer múltiples valores
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Manejar cambio de campo
  const handleChange = useCallback((field: keyof T) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = event.target as HTMLInputElement;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      setValue(field, value);
    };
  }, [setValue]);

  // Manejar blur de campo
  const handleBlur = useCallback((field: keyof T) => {
    return () => {
      setTouched(prev => ({ ...prev, [field]: true }));
      
      // Validar campo cuando pierde el foco
      const fieldValidation = validateField(field);
      setErrors(prev => ({
        ...prev,
        [field]: fieldValidation.errors
      }));
    };
  }, [validateField]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    setIsSubmitting(true);

    try {
      const validation = validateFormData();
      
      if (!validation.isValid) {
        onError?.(validation.errors);
        return;
      }

      await onSubmit?.(values);
    } catch (error) {
      console.error('Error en el formulario:', error);
      onError?.(['Error interno del servidor']);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateFormData, onSubmit, onError]);

  // Resetear formulario
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Calcular si el formulario es válido
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    setValues: setMultipleValues,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validateField,
    validateForm: validateFormData
  };
} 