import { BillingInfo } from '../../src/models/common/billing-info';

export class MockBillingInfo extends BillingInfo {
  streetAddress = '123 Fake St';
  extendedAddress = 'Apt 123';
  locality = 'San Francisco';
  region = 'CA';
  postalCode = '12345';
  countryCodeAlpha2 = 'US';
}
