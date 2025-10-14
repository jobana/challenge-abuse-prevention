export const QUERY_PARAMS = {
  CUSTOMER_DATA: 'customerData',
  SHIPPING_DATA: 'shippingData',
  BILLING_DATA: 'billingData',
  PAYMENT_DATA: 'paymentData',
  ORDER_DATA: 'orderData',
  REFERRER: 'referrer',
  TOKEN: 'token',
  STEP: 'step',
} as const;

export const DEFAULT_QUERY_PARAMS = {
  [QUERY_PARAMS.CUSTOMER_DATA]: null,
  [QUERY_PARAMS.SHIPPING_DATA]: null,
  [QUERY_PARAMS.BILLING_DATA]: null,
  [QUERY_PARAMS.PAYMENT_DATA]: null,
  [QUERY_PARAMS.ORDER_DATA]: null,
  [QUERY_PARAMS.REFERRER]: '/',
  [QUERY_PARAMS.TOKEN]: '',
  [QUERY_PARAMS.STEP]: 'verification',
} as const;

export const QUERY_PARAM_ENCODING = {
  ENCODE: true,
  DECODE: true,
} as const;
