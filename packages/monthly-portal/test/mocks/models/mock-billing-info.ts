import { BillingInfo } from '@internetarchive/donation-form-data-models';

export const mockBillingInfo = new BillingInfo({
  streetAddress: '123 Fake St',
  extendedAddress: 'Apt 123',
  locality: 'San Francisco',
  region: 'CA',
  postalCode: '12345',
  countryCodeAlpha2: 'US',
});
