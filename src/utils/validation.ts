import { ValidationError } from '../types/common.types.js';

// ============================================
// VALIDADORES BÁSICOS 
// ============================================

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

// ============================================
// VALIDADORES ESPECÍFICOS (Server-side)
// ============================================

/**
 * Valida nombre completo
 * - Requerido
 * - Entre 2 y 100 caracteres
 * - Solo letras, espacios y acentos
 */
export const validateName = (name: any): string | null => {
  if (!name || typeof name !== 'string') {
    return 'Name is required';
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (trimmedName.length > 100) {
    return 'Name cannot exceed 100 characters';
  }

  // Solo letras, espacios, acentos latinos y ñ
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãõÃÕçÇ\s]+$/;
  if (!nameRegex.test(trimmedName)) {
    return 'Name can only contain letters and spaces';
  }

  return null;
};

/**
 * Valida código de país
 * - Requerido
 * - Solo AR o BR (soportados actualmente)
 */
export const validateCountry = (country: any): string | null => {
  if (!country || typeof country !== 'string') {
    return 'Country is required';
  }

  const upperCountry = country.toUpperCase();
  const validCountries = ['AR', 'BR'];

  if (!validCountries.includes(upperCountry)) {
    return `Country must be one of: ${validCountries.join(', ')}`;
  }

  return null;
};

/**
 * Valida dirección
 * - Requerido
 * - Entre 10 y 200 caracteres
 */
export const validateAddress = (address: any): string | null => {
  if (!address || typeof address !== 'string') {
    return 'Address is required';
  }

  const trimmedAddress = address.trim();

  if (trimmedAddress.length < 10) {
    return 'Address must be at least 10 characters';
  }

  if (trimmedAddress.length > 200) {
    return 'Address cannot exceed 200 characters';
  }

  return null;
};

/**
 * Valida token de CAPTCHA
 * - Requerido
 * - Formato alfanumérico con guiones y guiones bajos
 */
export const validateCaptchaToken = (token: any): string | null => {
  if (!token || typeof token !== 'string') {
    return 'Captcha token is required';
  }

  const trimmedToken = token.trim();

  if (trimmedToken.length === 0) {
    return 'Captcha token cannot be empty';
  }

  // Google reCAPTCHA tokens son alfanuméricos con - y _
  const tokenRegex = /^[A-Za-z0-9_-]+$/;
  if (!tokenRegex.test(trimmedToken)) {
    return 'Invalid captcha token format';
  }

  return null;
};

// ============================================
// SANITIZACIÓN
// ============================================

/**
 * Sanitiza input de usuario para prevenir XSS
 * - Elimina HTML tags
 * - Escapa caracteres peligrosos
 * - Trim whitespace
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    // Eliminar HTML tags
    .replace(/<[^>]*>/g, '')
    // Escapar caracteres especiales HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Valida estructura completa de datos de verificación
 * Retorna array de errores o null si todo es válido
 */
export interface VerificationData {
  name: string;
  country: string;
  address: string;
  captchaToken: string;
}

export const validateVerificationData = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  const nameError = validateName(data?.name);
  if (nameError) {
    errors.push({ field: 'name', message: nameError });
  }

  const countryError = validateCountry(data?.country);
  if (countryError) {
    errors.push({ field: 'country', message: countryError });
  }

  const addressError = validateAddress(data?.address);
  if (addressError) {
    errors.push({ field: 'address', message: addressError });
  }

  const tokenError = validateCaptchaToken(data?.captchaToken);
  if (tokenError) {
    errors.push({ field: 'captchaToken', message: tokenError });
  }

  return errors;
};

/**
 * Sanitiza datos completos de verificación
 */
export const sanitizeVerificationData = (data: VerificationData): VerificationData => {
  return {
    name: sanitizeInput(data.name),
    country: data.country.toUpperCase().trim(),
    address: sanitizeInput(data.address),
    captchaToken: data.captchaToken.trim(),
  };
};
