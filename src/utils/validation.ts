// Sistema de validación centralizado

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export type ValidationSchema = {
  [key: string]: ValidationRule;
};

/**
 * Valida un campo según las reglas especificadas
 */
export function validateField(value: any, rules: ValidationRule): ValidationResult {
  const errors: string[] = [];

  // Validación requerida
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push('Este campo es obligatorio');
  }

  // Si no hay valor y no es requerido, es válido
  if (!value && !rules.required) {
    return { isValid: true, errors: [] };
  }

  // Validación de longitud mínima
  if (rules.minLength && value && value.toString().length < rules.minLength) {
    errors.push(`Mínimo ${rules.minLength} caracteres`);
  }

  // Validación de longitud máxima
  if (rules.maxLength && value && value.toString().length > rules.maxLength) {
    errors.push(`Máximo ${rules.maxLength} caracteres`);
  }

  // Validación de patrón
  if (rules.pattern && value && !rules.pattern.test(value.toString())) {
    errors.push('Formato inválido');
  }

  // Validación personalizada
  if (rules.custom && value) {
    const customResult = rules.custom(value);
    if (typeof customResult === 'string') {
      errors.push(customResult);
    } else if (!customResult) {
      errors.push('Valor inválido');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida un objeto completo según un esquema
 */
export function validateForm(data: any, schema: ValidationSchema): ValidationResult {
  const errors: string[] = [];
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const fieldValue = data[field];
    const fieldValidation = validateField(fieldValue, rules);
    
    if (!fieldValidation.isValid) {
      isValid = false;
      errors.push(...fieldValidation.errors.map(error => `${field}: ${error}`));
    }
  }

  return { isValid, errors };
}

// Reglas de validación predefinidas
export const validationRules = {
  required: { required: true },
  email: { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value.includes('@')) return 'Debe contener @';
      if (!value.includes('.')) return 'Debe contener un dominio válido';
      return true;
    }
  },
  password: { 
    required: true, 
    minLength: 8,
    custom: (value: string) => {
      if (!/[A-Z]/.test(value)) return 'Debe contener al menos una mayúscula';
      if (!/[a-z]/.test(value)) return 'Debe contener al menos una minúscula';
      if (!/\d/.test(value)) return 'Debe contener al menos un número';
      return true;
    }
  },
  username: { 
    required: true, 
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    custom: (value: string) => {
      if (value.includes(' ')) return 'No puede contener espacios';
      return true;
    }
  },
  title: { 
    required: true, 
    minLength: 5,
    maxLength: 100
  },
  content: { 
    required: true, 
    minLength: 10,
    maxLength: 5000
  },
  url: {
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return 'URL inválida';
      }
    }
  }
} as const;

// Esquemas de validación predefinidos
export const validationSchemas = {
  login: {
    email: validationRules.email,
    password: validationRules.required
  },
  register: {
    username: validationRules.username,
    email: validationRules.email,
    password: validationRules.password
  },
  post: {
    title: validationRules.title,
    content: validationRules.content
  },
  comment: {
    content: { ...validationRules.content, maxLength: 1000 }
  }
} as const; 