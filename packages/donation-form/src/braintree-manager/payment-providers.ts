import { PromisedSingleton } from '@internetarchive/promised-singleton';

import { CreditCardHandler } from './payment-providers/credit-card/credit-card';
import { ApplePayHandler } from './payment-providers/apple-pay/apple-pay';
import { VenmoHandler } from './payment-providers/venmo';
import { PayPalHandler } from './payment-providers/paypal/paypal';
import { ApplePaySessionManager } from './payment-providers/apple-pay/apple-pay-session-manager';
import { PaymentClientsInterface } from './payment-clients';
import { GooglePayHandler } from './payment-providers/google-pay';
import { BraintreeManagerInterface, HostingEnvironment } from './braintree-interfaces';
import { HostedFieldConfiguration } from './payment-providers/credit-card/hosted-field-configuration';
import { PaymentProvidersInterface } from './payment-providers-interface';
import { ApplePayHandlerInterface } from './payment-providers/apple-pay/apple-pay-interface';
import { CreditCardHandlerInterface } from './payment-providers/credit-card/credit-card-interface';
import { VenmoHandlerInterface } from './payment-providers/venmo-interface';
import { PayPalHandlerInterface } from './payment-providers/paypal/paypal-interface';
import { GooglePayHandlerInterface } from './payment-providers/google-pay-interface';

/**
 * The PaymentProviders class contains the IA-specific handlers for each of the
 * different payment providers.
 *
 * They are generally data-focused, as opposed to UI-focused, but there
 * is some cross-polination between PaymentProviders and FlowHandlers.
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
        return new ApplePayHandler({
          braintreeManager: this.braintreeManager,
          applePayClient: client,
          applePaySessionManager: applePaySessionManager,
        });
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
      generator: new Promise(async (resolve, reject) => {
        const googlePaymentsClient = this.paymentClients.googlePaymentsClient.get();
        const braintreeClient = this.paymentClients.googlePayBraintreeClient.get();

        return Promise.all([braintreeClient, googlePaymentsClient]).then(values => {
          const gPayBraintreeClient = values[0];
          const gPayClient = values[1];

          if (gPayClient) {
            const handler = new GooglePayHandler({
              braintreeManager: this.braintreeManager,
              googlePayMerchantId: this.googlePayMerchantId,
              googlePayBraintreeClient: gPayBraintreeClient,
              googlePaymentsClient: gPayClient,
            });
            resolve(handler);
          } else {
            reject('Google Payments Client not loaded');
          }
        });
      }),
    });
  }
}
