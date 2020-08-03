/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from '@open-wc/testing';
import { ApplePaySessionManager } from '../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-session-manager';
import { MockApplePaySession } from '../../mocks/payment-clients/mock-applepay-session';
import { ApplePayPaymentRequest } from 'braintree-web/modules/apple-pay';

describe('ApplePaySessionManager', () => {
  it('properly determines if payments can be made', async () => {
    (window['ApplePaySession' as any] as any) = MockApplePaySession;
    const sessionManager = new ApplePaySessionManager();
    expect(sessionManager.canMakePayments()).to.be.true;
    delete window['ApplePaySession' as any];
  });

  it('properly determines when payments cannot be made', async () => {
    const sessionManager = new ApplePaySessionManager();
    expect(sessionManager.canMakePayments()).to.be.false;
  });

  it('creates a new ApplePaySession', async () => {
    (window['ApplePaySession' as any] as any) = MockApplePaySession;
    const sessionManager = new ApplePaySessionManager();
    const request: ApplePayJS.ApplePayPaymentRequest = {
      total: {
        label: 'Foo Donation',
        amount: '3.50',
      },
      countryCode: 'US',
      currencyCode: 'USD',
      supportedNetworks: ['Foo', 'Bar'],
      merchantCapabilities: [],

      requiredBillingContactFields: ['postalAddress'],
      requiredShippingContactFields: ['name', 'email'],
    };
    const session = sessionManager.createNewPaymentSession(request) as MockApplePaySession;
    // console.debug(session);
    expect(session.versionCheck).to.equal(ApplePaySessionManager.VERSION);
    expect(session.paymentRequestCheck).to.deep.equal(request);
  });
});
