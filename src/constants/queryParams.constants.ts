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

export const QUERY_PARAM_ENCODING = {
  ENCODE: true,
  DECODE: true,
} as const;
