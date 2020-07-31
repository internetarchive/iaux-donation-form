import { expect } from '@open-wc/testing';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { VenmoHandler } from '../../../src/braintree-manager/payment-providers/venmo';
import { MockVenmoClient } from '../../mocks/payment-clients/mock-venmo-client';
import { PromisedSingleton } from '@internetarchive/promised-singleton';

describe('VenmoHandler', () => {
  it('calls tokenize on the client when startPayment() is called', async () => {
    const braintreeManager = new MockBraintreeManager();
    const venmoClient = new MockVenmoClient({
      isBrowserSupported: true
    })

    const instancePromisedSingleton = new PromisedSingleton<braintree.Venmo>({
      generator: new Promise(resolve => {
        resolve(venmoClient);
      })
    });

    const handler = new VenmoHandler({
      braintreeManager: braintreeManager,
      venmoClient: venmoClient,
      venmoProfileId: 'foo',
      instancePromisedSingleton: instancePromisedSingleton
    })
    await handler.startPayment();
    expect(venmoClient.tokenizeCalled).to.be.true;
  });

  describe('isBrowserSupported', () => {
    it('returns true if the browser is supported', async () => {
      const braintreeManager = new MockBraintreeManager();
      const venmoClient = new MockVenmoClient({
        isBrowserSupported: true
      })
      const handler = new VenmoHandler({
        braintreeManager: braintreeManager,
        venmoClient: venmoClient,
        venmoProfileId: 'foo'
      })
      const supported = await handler.isBrowserSupported();
      expect(supported).to.be.true;
    });

    it('returns false if the browser is not supported', async () => {
      const braintreeManager = new MockBraintreeManager();
      const venmoClient = new MockVenmoClient({
        isBrowserSupported: false
      })
      const handler = new VenmoHandler({
        braintreeManager: braintreeManager,
        venmoClient: venmoClient,
        venmoProfileId: 'foo'
      })
      const supported = await handler.isBrowserSupported();
      expect(supported).to.be.false;
    });

    it('returns false if the browser is mobile firefox', async () => {
      const originalUserAgent = navigator.userAgent;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any)['__defineGetter__']('userAgent', function() {
        return 'FxiOS Mobile';
      });

      const braintreeManager = new MockBraintreeManager();
      const venmoClient = new MockVenmoClient({
        isBrowserSupported: true // should be true but will be short-circuited by FireFox
      })
      const handler = new VenmoHandler({
        braintreeManager: braintreeManager,
        venmoClient: venmoClient,
        venmoProfileId: 'foo'
      })
      const supported = await handler.isBrowserSupported();
      expect(supported).to.be.false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any)['__defineGetter__']('userAgent', function() {
        return originalUserAgent;
      });
    });
  });
});
