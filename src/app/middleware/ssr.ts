import { logger } from '@utils/logger';
import { DecodedQueryParams } from '@types/queryParams.types';

export const extractDataFromQueryParams = (query: any): DecodedQueryParams => {
  const startTime = Date.now();
  
  try {
    const result: DecodedQueryParams = {
      referrer: query.referrer || '/',
      token: query.token || '',
      step: query.step || 'verification',
    };
    
    // Extraer datos de forma optimizada
    if (query.customerData) {
      result.customerData = JSON.parse(decodeURIComponent(query.customerData));
    }
    
    if (query.shippingData) {
      result.shippingData = JSON.parse(decodeURIComponent(query.shippingData));
    }
    
    if (query.billingData) {
      result.billingData = JSON.parse(decodeURIComponent(query.billingData));
    }
    
    if (query.paymentData) {
      result.paymentData = JSON.parse(decodeURIComponent(query.paymentData));
    }
    
    if (query.orderData) {
      result.orderData = JSON.parse(decodeURIComponent(query.orderData));
    }
    
    const processingTime = Date.now() - startTime;
    
    if (processingTime > 100) {
      logger.warn(`Slow query param extraction: ${processingTime}ms`);
    }
    
    return result;
    
  } catch (error) {
    logger.error('Error extracting query params:', error);
    
    // Retornar datos mínimos en caso de error
    return {
      referrer: query.referrer || '/',
      token: query.token || '',
      step: 'verification',
    };
  }
};

export const validateToken = (token: string): boolean => {
  if (!token) return false;
  
  // Validación básica del token
  // En producción, esto sería más robusto
  return token.length >= 10 && /^[a-zA-Z0-9]+$/.test(token);
};

export const sanitizeData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  // Sanitización básica para prevenir XSS
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitized[key]
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }
  });
  
  return sanitized;
};
