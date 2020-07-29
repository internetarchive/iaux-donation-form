/* eslint-disable @typescript-eslint/camelcase */
import { SuccessResponse } from '../../src/models/response-models/success-models/success-response';
import { DonationType } from '../../src/models/donation-info/donation-type';
import { PaymentProvider } from '../../src/models/common/payment-provider-name';
import { MockCustomerInfo } from './mock-customer-info';
import { MockBillingInfo } from './mock-billing-info';

export const mockSuccessResponse = new SuccessResponse({
  paymentProvider: PaymentProvider.CreditCard,
  paymentMethodNonce: 'foo-nonce',
  amount: 5,
  donationType: DonationType.OneTime,
  transaction_id: '123',
  customer_id: '123',
  customer: new MockCustomerInfo(),
  billing: new MockBillingInfo(),
});
