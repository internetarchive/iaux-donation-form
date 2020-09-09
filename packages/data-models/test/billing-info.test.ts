import { expect } from '@open-wc/testing';
import { BillingInfo } from '../src/common/billing-info';

describe('BillingInfo', () => {
  it('can initialize without any properties', async () => {
    const billing = new BillingInfo();

    expect(billing.streetAddress).to.be.undefined;
  });

  it('can initialize with all the properties', async () => {
    const customer = new BillingInfo({
      streetAddress: '123 Fake St',
      extendedAddress: 'Apt 123',
      locality: 'SF',
      region: 'CA',
      postalCode: '12345',
      countryCodeAlpha2: 'US',
    });

    expect(customer.streetAddress).to.equal('123 Fake St');
    expect(customer.extendedAddress).to.equal('Apt 123');
    expect(customer.locality).to.equal('SF');
    expect(customer.region).to.equal('CA');
    expect(customer.postalCode).to.equal('12345');
    expect(customer.countryCodeAlpha2).to.equal('US');
  });
});
