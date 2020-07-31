import { expect } from '@open-wc/testing';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { ApplePayHandler } from '../../../src/braintree-manager/payment-providers/apple-pay/apple-pay';
import { MockApplePayClient } from '../../mocks/payment-clients/mock-applepay-client';
import { MockApplePaySessionManager } from '../../mocks/payment-clients/mock-applepay-sessionmanager';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { DonationPaymentInfo } from '../../../src/models/donation-info/donation-payment-info';

describe('ApplePayHandler', () => {
  describe('isAvailable', () => {
    it('returns true if the browser is supported', async () => {
      const braintreeManager = new MockBraintreeManager();
      const applePayClient = new MockApplePayClient();
      const sessionManager = new MockApplePaySessionManager({
        canMakePayments: true,
      });
      const handler = new ApplePayHandler({
        braintreeManager: braintreeManager,
        applePayClient: applePayClient,
        applePaySessionManager: sessionManager,
      });
      const supported = await handler.isAvailable();
      expect(supported).to.be.true;
    });

    it('returns false if the browser is not supported', async () => {
      const braintreeManager = new MockBraintreeManager();
      const applePayClient = new MockApplePayClient();
      const sessionManager = new MockApplePaySessionManager({
        canMakePayments: false,
      });
      const handler = new ApplePayHandler({
        braintreeManager: braintreeManager,
        applePayClient: applePayClient,
        applePaySessionManager: sessionManager,
      });
      const supported = await handler.isAvailable();
      expect(supported).to.be.false;
    });

    it('returns false if there was an error', async () => {
      const braintreeManager = new MockBraintreeManager();
      const applePayClient = new MockApplePayClient();
      const sessionManager = new MockApplePaySessionManager({
        canMakePayments: true, // should be true, but will be short circuited by the rejection
      });
      const instancePromisedSingleton = new PromisedSingleton<any>({
        generator: new Promise((resolve, reject) => {
          reject();
        }),
      });
      const handler = new ApplePayHandler({
        braintreeManager: braintreeManager,
        applePayClient: applePayClient,
        applePaySessionManager: sessionManager,
        instancePromisedSingleton: instancePromisedSingleton,
      });
      const supported = await handler.isAvailable();
      expect(supported).to.be.false;
    });
  });

  describe('createPaymentRequest', () => {
    it('creates a datasource properly', async () => {
      const braintreeManager = new MockBraintreeManager();
      const applePayClient = new MockApplePayClient();
      const sessionManager = new MockApplePaySessionManager({
        canMakePayments: true,
      });
      const handler = new ApplePayHandler({
        braintreeManager: braintreeManager,
        applePayClient: applePayClient,
        applePaySessionManager: sessionManager,
      });
      const event = new Event('boop');
      const datasource = await handler.createPaymentRequest(event, DonationPaymentInfo.default);
      expect(datasource.donationInfo.amount).to.equal(5);
    });
  });
});
