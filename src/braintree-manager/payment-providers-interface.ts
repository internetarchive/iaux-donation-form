import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { ApplePayHandlerInterface } from './payment-providers/apple-pay/apple-pay-interface';
import { CreditCardHandlerInterface } from './payment-providers/credit-card/credit-card-interface';
import { VenmoHandlerInterface } from './payment-providers/venmo-interface';
import { PayPalHandlerInterface } from './payment-providers/paypal/paypal-interface';
import { GooglePayHandlerInterface } from './payment-providers/google-pay-interface';

export interface PaymentProvidersInterface {
  creditCardHandler: PromisedSingleton<CreditCardHandlerInterface>;
  applePayHandler: PromisedSingleton<ApplePayHandlerInterface>;
  venmoHandler: PromisedSingleton<VenmoHandlerInterface | undefined>;
  paypalHandler: PromisedSingleton<PayPalHandlerInterface>;
  googlePayHandler: PromisedSingleton<GooglePayHandlerInterface>;
}
