import { VenmoHandlerInterface } from '../../../../src/braintree-manager/payment-providers/venmo';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { MockVenmoClient } from '../../payment-clients/mock-venmo-client';

export class MockVenmoHandler implements VenmoHandlerInterface {
  instance: PromisedSingleton<braintree.Venmo> = new PromisedSingleton<braintree.Venmo>({
    generator: new Promise<braintree.Venmo>(resolve => {
      resolve(new MockVenmoClient());
    }),
  });
  async isBrowserSupported(): Promise<boolean> {
    return true;
  }
  startPayment(): Promise<import('braintree-web').VenmoTokenizePayload> {
    throw new Error('Method not implemented.');
  }
}
