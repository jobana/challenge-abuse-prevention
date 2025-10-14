import { ValidationError } from '@types/common.types';

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email es requerido';
  if (!emailRegex.test(email)) return 'Email inválido';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phone) return 'Teléfono es requerido';
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Teléfono inválido';
  return null;
};

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

export const validateDocumentNumber = (documentNumber: string, documentType: string): string | null => {
  if (!documentNumber) return 'Número de documento es requerido';
  
  switch (documentType) {
    case 'dni':
      if (!/^\d{8}$/.test(documentNumber)) return 'DNI debe tener 8 dígitos';
      break;
    case 'passport':
      if (!/^[A-Z0-9]{6,12}$/.test(documentNumber)) return 'Pasaporte inválido';
      break;
    case 'cedula':
      if (!/^\d{7,10}$/.test(documentNumber)) return 'Cédula inválida';
      break;
  }
  
  return null;
};

export const validateCardNumber = (cardNumber: string): string | null => {
  if (!cardNumber) return 'Número de tarjeta es requerido';
  
  // Remove spaces and validate
  const cleanNumber = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleanNumber)) return 'Número de tarjeta inválido';
  
  // Luhn algorithm validation
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) return 'Número de tarjeta inválido';
  return null;
};

export const validateExpiryDate = (expiryDate: string): string | null => {
  if (!expiryDate) return 'Fecha de vencimiento es requerida';
  
  const [month, year] = expiryDate.split('/');
  if (!month || !year) return 'Formato inválido (MM/YY)';
  
  const monthNum = parseInt(month);
  const yearNum = parseInt('20' + year);
  
  if (monthNum < 1 || monthNum > 12) return 'Mes inválido';
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return 'Tarjeta expirada';
  }
  
  return null;
};

export const validateCVV = (cvv: string): string | null => {
  if (!cvv) return 'CVV es requerido';
  if (!/^\d{3,4}$/.test(cvv)) return 'CVV inválido';
  return null;
};

export const validatePostalCode = (postalCode: string, country: string): string | null => {
  if (!postalCode) return 'Código postal es requerido';
  
  // Basic validation - can be extended for specific countries
  if (postalCode.length < 3 || postalCode.length > 10) {
    return 'Código postal inválido';
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
