import { expect } from '@open-wc/testing';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { MockGooglePaymentClient } from '../../mocks/payment-clients/mock-googlepay-client';
import { MockGooglePayLibrary } from '../../mocks/payment-clients/mock-googlepay-library';
import { GooglePayHandler } from '../../../src/braintree-manager/payment-providers/google-pay';

describe('GooglePayHandler', () => {
  it('returns the GooglePayment instance', async () => {
    const braintreeManager = new MockBraintreeManager();
    const googlePayBraintreeClient = new MockGooglePaymentClient();
    const googlePayLibrary = new MockGooglePayLibrary();
    const handler = new GooglePayHandler({
      braintreeManager: braintreeManager,
      googlePayBraintreeClient: googlePayBraintreeClient,
      googlePaymentsClient: googlePayLibrary,
    });

    const instance = await handler.instance.get();

    expect(instance instanceof MockGooglePaymentClient).to.be.true;
  });

  describe('isBrowserSupported', () => {
    it('returns true if the browser is supported', async () => {
      const braintreeManager = new MockBraintreeManager();
      const googlePayBraintreeClient = new MockGooglePaymentClient();
      const googlePayLibrary = new MockGooglePayLibrary();

      googlePayLibrary.readyToPay = true;

      const handler = new GooglePayHandler({
        braintreeManager: braintreeManager,
        googlePayBraintreeClient: googlePayBraintreeClient,
        googlePaymentsClient: googlePayLibrary,
      });

      const supported = await handler.isBrowserSupported();

      expect(supported).to.be.true;
    });

    it('returns false if the browser is not supported', async () => {
      const braintreeManager = new MockBraintreeManager();
      const googlePayBraintreeClient = new MockGooglePaymentClient();
      const googlePayLibrary = new MockGooglePayLibrary();
      googlePayLibrary.readyToPay = false;

      const handler = new GooglePayHandler({
        braintreeManager: braintreeManager,
        googlePayBraintreeClient: googlePayBraintreeClient,
        googlePaymentsClient: googlePayLibrary,
      });

      const supported = await handler.isBrowserSupported();

      expect(supported).to.be.false;
    });
  });
});
