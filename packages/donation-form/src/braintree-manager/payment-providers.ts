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
import { PaymentProvidersEvents, PaymentProvidersInterface } from './payment-providers-interface';
import { ApplePayHandlerInterface } from './payment-providers/apple-pay/apple-pay-interface';
import { CreditCardHandlerInterface } from './payment-providers/credit-card/credit-card-interface';
import { VenmoHandlerInterface } from './payment-providers/venmo-interface';
import { PayPalHandlerInterface } from './payment-providers/paypal/paypal-interface';
import { GooglePayHandlerInterface } from './payment-providers/google-pay-interface';
import { createNanoEvents, Unsubscribe } from 'nanoevents';

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
  on<E extends keyof PaymentProvidersEvents>(
    event: E,
    callback: PaymentProvidersEvents[E],
  ): Unsubscribe {
    return this.emitter.on(event, callback);
  }

  creditCardHandler = new PromisedSingleton<CreditCardHandlerInterface>({
    generator: async (): Promise<CreditCardHandlerInterface> => {
      const client = await this.paymentClients.hostedFields.get();
      const handler = new CreditCardHandler({
        braintreeManager: this.braintreeManager,
        hostedFieldClient: client,
        hostedFieldConfig: this.hostedFieldConfig,
      });

      handler.on('hostedFieldsRetry', (retryNumber: number) => {
        this.emitter.emit('hostedFieldsRetry', retryNumber);
      });

      handler.on('hostedFieldsFailed', (error: unknown) => {
        this.emitter.emit('hostedFieldsFailed', error);
      });

      return handler;
    },
  });

  applePayHandler = new PromisedSingleton<ApplePayHandlerInterface>({
    generator: async (): Promise<ApplePayHandlerInterface> => {
      const client = await this.paymentClients.applePay.get();
      const applePaySessionManager = new ApplePaySessionManager();
      return new ApplePayHandler({
        braintreeManager: this.braintreeManager,
        applePayClient: client,
        applePaySessionManager: applePaySessionManager,
      });
    },
  });

  venmoHandler = new PromisedSingleton<VenmoHandlerInterface | undefined>({
    generator: async (): Promise<VenmoHandlerInterface | undefined> => {
      const client = await this.paymentClients.venmo.get();
      if (!this.venmoProfileId) {
        return undefined;
      }
      return new VenmoHandler({
        braintreeManager: this.braintreeManager,
        venmoClient: client,
        venmoProfileId: this.venmoProfileId,
      });
    },
  });

  paypalHandler = new PromisedSingleton<PayPalHandlerInterface>({
    generator: async (): Promise<PayPalHandlerInterface> => {
      const paypalLibrary = this.paymentClients.paypalLibrary.get();
      const client = this.paymentClients.payPal.get();

      const values = await Promise.all([client, paypalLibrary]);
      const handler = new PayPalHandler({
        braintreeManager: this.braintreeManager,
        paypalClient: values[0],
        paypalButton: values[1].Button,
        hostingEnvironment: this.hostingEnvironment,
      });
      return handler;
    },
  });

  googlePayHandler = new PromisedSingleton<GooglePayHandlerInterface>({
    generator: async (): Promise<GooglePayHandlerInterface> => {
      const googlePaymentsClient = this.paymentClients.googlePaymentsClient.get();
      const braintreeClient = this.paymentClients.googlePayBraintreeClient.get();

      const values = await Promise.all([braintreeClient, googlePaymentsClient]);
      const handler = new GooglePayHandler({
        braintreeManager: this.braintreeManager,
        googlePayMerchantId: this.googlePayMerchantId,
        googlePayBraintreeClient: values[0],
        googlePaymentsClient: values[1],
      });
      return handler;
    },
  });

  private braintreeManager: BraintreeManagerInterface;

  private venmoProfileId?: string;

  private googlePayMerchantId?: string;

  private hostedFieldConfig: HostedFieldConfiguration;

  private hostingEnvironment: HostingEnvironment = HostingEnvironment.Development;

  private paymentClients: PaymentClientsInterface;

  private emitter = createNanoEvents<PaymentProvidersEvents>();

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
  }
}
