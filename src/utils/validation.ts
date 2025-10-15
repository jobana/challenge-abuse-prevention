import { ValidationError } from '@types/common.types';

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} es requerido`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value && value.length < minLength) {
    return `${fieldName} debe tener al menos ${minLength} caracteres`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value && value.length > maxLength) {
    return `${fieldName} no puede tener más de ${maxLength} caracteres`;
  }
  return null;
};

export const validateForm = (data: any, rules: Record<string, (value: any) => string | null>): ValidationError[] => {
  const errors: ValidationError[] = [];

  Object.entries(rules).forEach(([field, validator]) => {
    const error = validator(data[field]);
    if (error) {
      errors.push({ field, message: error });
    }
  });

  return errors;
};
