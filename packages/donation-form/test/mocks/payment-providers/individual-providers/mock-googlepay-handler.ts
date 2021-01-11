import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { MockGooglePaymentClient } from '../../payment-clients/mock-googlepay-client';
import { MockGooglePayLibrary } from '../../payment-clients/mock-googlepay-library';
import { GooglePayHandlerInterface } from '../../../../src/braintree-manager/payment-providers/google-pay-interface';

export class MockGooglePayHandler implements GooglePayHandlerInterface {
  paymentsClient: google.payments.api.PaymentsClient = new MockGooglePayLibrary();

  instance: PromisedSingleton<braintree.GooglePayment> = new PromisedSingleton<
    braintree.GooglePayment
  >({
    generator: (): Promise<braintree.GooglePayment> =>
      new Promise<braintree.GooglePayment>(resolve => {
        resolve(new MockGooglePaymentClient());
      }),
  });

  isBrowserSupported(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
