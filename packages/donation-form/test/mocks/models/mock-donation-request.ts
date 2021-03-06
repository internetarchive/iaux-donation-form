import {
  DonationRequest,
  DonationType,
  PaymentProvider,
} from '@internetarchive/donation-form-data-models';
import { mockCustomerInfo } from './mock-customer-info';
import { mockBillingInfo } from './mock-billing-info';
import { mockCustomFields } from './mock-custom-fields';

export const mockDonationRequest = new DonationRequest({
  paymentProvider: PaymentProvider.CreditCard,
  paymentMethodNonce: 'fake-valid-nonce',
  recaptchaToken: 'fake-recaptcha-token',
  customerId: 'fake-customer-id',
  deviceData: '{"correlation_id":"356a3b0fe3c1f1bcabdcde4fafdb8d48"}',

  bin: '123456',
  binName: 'Foo Bank of Bar Islands',

  amount: 5.0,
  donationType: DonationType.OneTime,

  customer: mockCustomerInfo,
  billing: mockBillingInfo,
  customFields: mockCustomFields,
});
