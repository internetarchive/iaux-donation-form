import { expect } from '@open-wc/testing';
import { CustomerInfo } from '../src/common/customer-info';

describe('CustomerInfo', () => {
  it('can initialize without any properties', async () => {
    const customer = new CustomerInfo();

    expect(customer.email).to.be.undefined;
  });

  it('can initialize with all the properties', async () => {
    const customer = new CustomerInfo({
      email: 'foo@bar.com',
      firstName: 'foo',
      lastName: 'bar',
    });

    expect(customer.email).to.equal('foo@bar.com');
    expect(customer.firstName).to.equal('foo');
    expect(customer.lastName).to.equal('bar');
  });
});
