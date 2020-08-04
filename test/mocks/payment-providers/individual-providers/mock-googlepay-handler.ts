import { GooglePayHandlerInterface } from '../../../../src/braintree-manager/payment-providers/google-pay';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { MockGooglePaymentClient } from '../../payment-clients/mock-googlepay-client';
import { MockGooglePayLibrary } from '../../payment-clients/mock-googlepay-library';

export class MockGooglePayHandler implements GooglePayHandlerInterface {
  paymentsClient: google.payments.api.PaymentsClient = new MockGooglePayLibrary({
    isReadyToPay: true,
  });

  instance: PromisedSingleton<braintree.GooglePayment> = new PromisedSingleton<braintree.GooglePayment>({
    generator: new Promise<braintree.GooglePayment>(resolve => {
      resolve(new MockGooglePaymentClient());
    }),
  });

  isBrowserSupported(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
