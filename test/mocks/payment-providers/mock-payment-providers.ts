import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { MockVenmoHandler } from './individual-providers/mock-venmo-handler';
import { MockCreditCardHandler } from './individual-providers/mock-creditcard-handler';
import { MockApplePayHandler } from './individual-providers/mock-applepay-handler';
import { MockPayPalHandler } from './individual-providers/mock-paypal-handler';
import { MockGooglePayHandler } from './individual-providers/mock-googlepay-handler';
import { mockHostedFieldTokenizePayload } from '../payment-clients/mock-hostedfieldtokenizepayload';
import { PaymentProvidersInterface } from '../../../src/braintree-manager/payment-providers-interface';
import { CreditCardHandlerInterface } from '../../../src/braintree-manager/payment-providers/credit-card/credit-card-interface';
import { ApplePayHandlerInterface } from '../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-interface';
import { PayPalHandlerInterface } from '../../../src/braintree-manager/payment-providers/paypal/paypal-interface';
import { GooglePayHandlerInterface } from '../../../src/braintree-manager/payment-providers/google-pay-interface';
import { VenmoHandlerInterface } from '../../../src/braintree-manager/payment-providers/venmo-interface';

export class MockPaymentProviders implements PaymentProvidersInterface {
  creditCardHandler: PromisedSingleton<CreditCardHandlerInterface> = new PromisedSingleton<
    CreditCardHandlerInterface
  >({
    generator: new Promise<CreditCardHandlerInterface>(resolve => {
      resolve(
        new MockCreditCardHandler({
          mockPayload: this.mockHostedFieldTokenizePayload,
        }),
      );
    }),
  });

  applePayHandler: PromisedSingleton<ApplePayHandlerInterface> = new PromisedSingleton<
    ApplePayHandlerInterface
  >({
    generator: new Promise<ApplePayHandlerInterface>(resolve => {
      resolve(new MockApplePayHandler());
    }),
  });

  paypalHandler: PromisedSingleton<PayPalHandlerInterface> = new PromisedSingleton<
    PayPalHandlerInterface
  >({
    generator: new Promise<PayPalHandlerInterface>(resolve => {
      resolve(new MockPayPalHandler());
    }),
  });

  googlePayHandler: PromisedSingleton<GooglePayHandlerInterface> = new PromisedSingleton<
    GooglePayHandlerInterface
  >({
    generator: new Promise<GooglePayHandlerInterface>(resolve => {
      resolve(new MockGooglePayHandler());
    }),
  });

  venmoHandler: PromisedSingleton<VenmoHandlerInterface> = new PromisedSingleton<
    VenmoHandlerInterface
  >({
    generator: new Promise<VenmoHandlerInterface>(resolve => {
      resolve(new MockVenmoHandler());
    }),
  });

  constructor(options?: {
    mockHostedFieldTokenizePayload?: braintree.HostedFieldsTokenizePayload;
  }) {
    this.mockHostedFieldTokenizePayload =
      options?.mockHostedFieldTokenizePayload ?? mockHostedFieldTokenizePayload;
  }

  mockHostedFieldTokenizePayload: braintree.HostedFieldsTokenizePayload;
}
