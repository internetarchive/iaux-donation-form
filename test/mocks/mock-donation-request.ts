import { DonationRequest } from '../../src/models/request-models/donation-request';
import { DonationType } from '../../src/models/donation-info/donation-type';
import { PaymentProvider } from '../../src/models/common/payment-provider-name';

export const mockSuccessResponse = new DonationRequest({
  paymentProvider: PaymentProvider.CreditCard,
  paymentMethodNonce: 'fake-valid-nonce',
  recaptchaToken: 'fake-recaptcha-token',
  customerId: 'fake-customer-id',
  deviceData: '{"correlation_id":"356a3b0fe3c1f1bcabdcde4fafdb8d48"}',

  bin: '123456',
  binName: 'Foo Bank of Bar Islands',

  amount: 5.0,
  donationType: DonationType.OneTime,

  customer: {
    email: 'foo@bar.com',
    firstName: 'Fooey',
    lastName: 'McBarison',
  },
  billing: {
    streetAddress: '123 Fake St',
    extendedAddress: 'Apt 123',
    locality: 'San Francisco',
    region: 'CA',
    postalCode: '94105',
    countryCodeAlpha2: 'US',
  },
  customFields: {
    // eslint-disable-next-line @typescript-eslint/camelcase
    logged_in_user: 'some-username',
    referrer: 'https://wayback/some-url',
  }
});
