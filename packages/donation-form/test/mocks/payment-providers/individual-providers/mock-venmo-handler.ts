import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { MockVenmoClient } from '../../payment-clients/mock-venmo-client';
import { VenmoHandlerInterface } from '../../../../src/braintree-manager/payment-providers/venmo-interface';

export class MockVenmoHandler implements VenmoHandlerInterface {
  instance: PromisedSingleton<braintree.Venmo> = new PromisedSingleton<braintree.Venmo>({
    generator: (): Promise<braintree.Venmo> =>
      new Promise<braintree.Venmo>(resolve => {
        resolve(
          new MockVenmoClient({
            isBrowserSupported: true,
          }),
        );
      }),
  });
  async isBrowserSupported(): Promise<boolean> {
    return true;
  }
  startPayment(): Promise<braintree.VenmoTokenizePayload> {
    throw new Error('Method not implemented.');
  }
}
