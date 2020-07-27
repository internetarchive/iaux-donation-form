import { PromisedSingleton } from '@internetarchive/promised-singleton';

import {
  CreditCardHandlerInterface,
  CreditCardHandler,
} from './payment-providers/credit-card/credit-card';
import { ApplePayHandlerInterface, ApplePayHandler } from './payment-providers/apple-pay/apple-pay';
import { VenmoHandlerInterface, VenmoHandler } from './payment-providers/venmo';
import { PayPalHandlerInterface, PayPalHandler } from './payment-providers/paypal/paypal';
import { ApplePaySessionManager } from './payment-providers/apple-pay/apple-pay-session-manager';
import { PaymentClientsInterface } from './payment-clients';
import { GooglePayHandlerInterface, GooglePayHandler } from './payment-providers/google-pay';
import { BraintreeManagerInterface, HostingEnvironment } from './braintree-interfaces';
import { HostedFieldConfiguration } from './payment-providers/credit-card/hosted-field-configuration';

export interface PaymentProvidersInterface {
  creditCardHandler: PromisedSingleton<CreditCardHandlerInterface>;
  applePayHandler: PromisedSingleton<ApplePayHandlerInterface>;
  venmoHandler: PromisedSingleton<VenmoHandlerInterface | undefined>;
  paypalHandler: PromisedSingleton<PayPalHandlerInterface>;
  googlePayHandler: PromisedSingleton<GooglePayHandlerInterface>;
}

/**
 * The PaymentProviders class contains the IA-specific handlers for each of the
 * different payment providers.
 *
 * @export
 * @class PaymentProviders
 * @implements {PaymentProvidersInterface}
 */
export class PaymentProviders implements PaymentProvidersInterface {
  creditCardHandler: PromisedSingleton<CreditCardHandlerInterface>;

  applePayHandler: PromisedSingleton<ApplePayHandlerInterface>;

  venmoHandler: PromisedSingleton<VenmoHandlerInterface | undefined>;

  paypalHandler: PromisedSingleton<PayPalHandlerInterface>;

  googlePayHandler: PromisedSingleton<GooglePayHandlerInterface>;

  private braintreeManager: BraintreeManagerInterface;

  private venmoProfileId?: string;

  private googlePayMerchantId?: string;

  private hostedFieldConfig: HostedFieldConfiguration;

  private hostingEnvironment: HostingEnvironment = HostingEnvironment.Development;

  private paymentClients: PaymentClientsInterface;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    paymentClients: PaymentClientsInterface;
    venmoProfileId?: string;
    googlePayMerchantId?: string;
    hostingEnvironment: HostingEnvironment;
    hostedFieldConfig: HostedFieldConfiguration;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.venmoProfileId = options.venmoProfileId;
    this.googlePayMerchantId = options.googlePayMerchantId;
    this.paymentClients = options.paymentClients;
    this.hostingEnvironment = options.hostingEnvironment;
    this.hostedFieldConfig = options.hostedFieldConfig;

    this.creditCardHandler = new PromisedSingleton<CreditCardHandlerInterface>({
      generator: this.paymentClients.hostedFields.get().then(client => {
        return new CreditCardHandler({
          braintreeManager: this.braintreeManager,
          hostedFieldClient: client,
          hostedFieldConfig: this.hostedFieldConfig,
        });
      }),
    });

    this.applePayHandler = new PromisedSingleton<ApplePayHandlerInterface>({
      generator: this.paymentClients.applePay.get().then(client => {
        const applePaySessionManager = new ApplePaySessionManager();
        return new ApplePayHandler(this.braintreeManager, client, applePaySessionManager);
      }),
    });

    this.venmoHandler = new PromisedSingleton<VenmoHandlerInterface | undefined>({
      generator: this.paymentClients.venmo.get().then(client => {
        if (!this.venmoProfileId) {
          return undefined;
        }
        return new VenmoHandler({
          braintreeManager: this.braintreeManager,
          venmoClient: client,
          venmoProfileId: this.venmoProfileId,
        });
      }),
    });

    this.paypalHandler = new PromisedSingleton<PayPalHandlerInterface>({
      generator: new Promise(async resolve => {
        const paypalLibrary = this.paymentClients.paypalLibrary.get();
        const client = this.paymentClients.payPal.get();

        const values = await Promise.all([client, paypalLibrary]);
        const handler = new PayPalHandler({
          braintreeManager: this.braintreeManager,
          paypalClient: values[0],
          paypalButton: values[1].Button,
          hostingEnvironment: this.hostingEnvironment,
        });
        resolve(handler);
      }),
    });

    this.googlePayHandler = new PromisedSingleton<GooglePayHandlerInterface>({
      generator: new Promise(async resolve => {
        const googlePaymentsClient = this.paymentClients.googlePaymentsClient.get();
        const braintreeClient = this.paymentClients.googlePayBraintreeClient.get();

        return Promise.all([braintreeClient, googlePaymentsClient]).then(values => {
          const handler = new GooglePayHandler({
            braintreeManager: this.braintreeManager,
            googlePayMerchantId: this.googlePayMerchantId,
            googlePayBraintreeClient: values[0],
            googlePaymentsClient: values[1],
          });
          resolve(handler);
        });
      }),
    });
  }
}
