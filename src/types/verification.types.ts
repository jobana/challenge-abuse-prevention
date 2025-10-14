import { BaseEntity } from './common.types';

export interface CustomerData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: 'dni' | 'passport' | 'cedula';
  documentNumber: string;
}

export interface Address {
  id?: string;
  street: string;
  number: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingData {
  id?: string;
  customerId: string;
  address: Address;
  method: 'standard' | 'express' | 'overnight';
  estimatedDays: number;
  cost: number;
}

export interface BillingData {
  id?: string;
  customerId: string;
  address: Address;
  sameAsShipping: boolean;
}

export interface PaymentMethod {
  id?: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  paypalEmail?: string;
  bankAccount?: string;
}

export interface PaymentData {
  id?: string;
  customerId: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'declined' | 'refunded';
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderData {
  id?: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
}

export interface VerificationData {
  customer: CustomerData;
  shipping: ShippingData;
  billing: BillingData;
  payment: PaymentData;
  order: OrderData;
}

export interface VerificationFormData {
  customer: Partial<CustomerData>;
  shipping: Partial<ShippingData>;
  billing: Partial<BillingData>;
  payment: Partial<PaymentData>;
  order: Partial<OrderData>;
}

export interface VerificationErrors {
  customer?: Record<string, string>;
  shipping?: Record<string, string>;
  billing?: Record<string, string>;
  payment?: Record<string, string>;
  order?: Record<string, string>;
}
