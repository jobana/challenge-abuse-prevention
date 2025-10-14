export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  CUSTOMER: '/customer',
  SHIPPING: '/shipping',
  BILLING: '/billing',
  PAYMENT: '/payment',
  ORDER: '/order',
  VERIFICATION: '/verification',
  SUBMIT: '/verification/submit',
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_TIMEOUT = 10000; // 10 seconds
