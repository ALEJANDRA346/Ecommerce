export type PaymentMethodType = 
  | 'credit_card' 
  | 'debit_card' 
  | 'paypal' 
  | 'bank_transfer' 
  | 'cash_on_delivery';

export type PaymentMethod = {
  _id: string;
  type: PaymentMethodType;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  paypalEmail?: string;
  bankName?: string;
  accountNumber?: string;
  isDefault: boolean;
  isActive: boolean;
};
