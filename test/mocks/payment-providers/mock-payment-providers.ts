import { PaymentProvidersInterface } from '../../../src/braintree-manager/payment-providers';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { CreditCardHandlerInterface } from '../../../src/braintree-manager/payment-providers/credit-card/credit-card';
import { ApplePayHandlerInterface } from '../../../src/braintree-manager/payment-providers/apple-pay/apple-pay';
import { PayPalHandlerInterface } from '../../../src/braintree-manager/payment-providers/paypal/paypal';
import { GooglePayHandlerInterface } from '../../../src/braintree-manager/payment-providers/google-pay';
import { VenmoHandlerInterface } from '../../../src/braintree-manager/payment-providers/venmo';
import { MockVenmoHandler } from './individual-providers/mock-venmo-handler';
import { MockCreditCardHandler } from './individual-providers/mock-creditcard-handler';
import { MockApplePayHandler } from './individual-providers/mock-applepay-handler';
import { MockPayPalHandler } from './individual-providers/mock-paypal-handler';
import { MockGooglePayHandler } from './individual-providers/mock-googlepay-handler';

export class MockPaymentProviders implements PaymentProvidersInterface {
  creditCardHandler: PromisedSingleton<CreditCardHandlerInterface> = new PromisedSingleton<
    CreditCardHandlerInterface
  >({
    generator: new Promise<CreditCardHandlerInterface>(resolve => {
      resolve(new MockCreditCardHandler());
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
}
