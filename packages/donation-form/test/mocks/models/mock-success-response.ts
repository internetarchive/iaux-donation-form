/* eslint-disable @typescript-eslint/camelcase */
import {
  SuccessResponse,
  DonationType,
  PaymentProvider,
} from '@internetarchive/donation-form-data-models';
import { mockCustomerInfo } from './mock-customer-info';
import { mockBillingInfo } from './mock-billing-info';

export const mockSuccessResponse = new SuccessResponse({
  paymentProvider: PaymentProvider.CreditCard,
  paymentMethodNonce: 'foo-nonce',
  amount: 5,
  donationType: DonationType.OneTime,
  transaction_id: '123',
  customer_id: '123',
  customer: mockCustomerInfo,
  billing: mockBillingInfo,
});
