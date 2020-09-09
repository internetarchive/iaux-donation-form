/* eslint-disable @typescript-eslint/camelcase */
import { SuccessResponse } from '../src/response-models/success-models/success-response';
import { PaymentProvider } from '../src/common/payment-provider-name';
import { DonationType } from '../src/donation-info/donation-type';
import { CustomerInfo } from '../src/common/customer-info';
import { BillingInfo } from '../src/common/billing-info';
import { expect } from '@open-wc/testing';
import { SubscriptionResponse } from '../src/response-models/success-models/subscription-response';

describe('SuccessResponse', () => {
  it('can initialize with a subscription', async () => {
    const subscription = new SubscriptionResponse({
      id: '12345',
    });

    const successResponse = new SuccessResponse({
      paymentProvider: PaymentProvider.CreditCard,
      paymentMethodNonce: 'foo',
      amount: 12.34,
      donationType: DonationType.OneTime,
      transaction_id: 'bar',
      customer_id: '12345',
      customer: new CustomerInfo({
        email: 'foo@bar.com',
        firstName: 'foo',
        lastName: 'bar',
      }),
      billing: new BillingInfo({
        streetAddress: '123 Fake St',
        extendedAddress: 'Apt 123',
        locality: 'SF',
        region: 'CA',
        postalCode: '12345',
        countryCodeAlpha2: 'US',
      }),
      subscription: subscription,
    });

    expect(successResponse.subscription?.id).to.equal('12345');
  });
});
