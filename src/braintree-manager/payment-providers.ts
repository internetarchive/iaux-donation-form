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
  getCreditCardHandler(): Promise<CreditCardHandlerInterface>;
  getApplePayHandler(): Promise<ApplePayHandlerInterface>;
  getVenmoHandler(): Promise<VenmoHandlerInterface | undefined>;
  getPaypalHandler(): Promise<PayPalHandlerInterface>;
  getGooglePayHandler(): Promise<GooglePayHandlerInterface>;
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
  private handlerPromise?: Promise<CreditCardHandlerInterface>;

  async getCreditCardHandler(): Promise<CreditCardHandlerInterface> {
    console.debug('getCreditCardHandler START', this.identifier);

    if (this.creditCardHandlerCache) {
      console.debug('getCreditCardHandler creditCardHandlerCache exists returning', this.identifier);
      return this.creditCardHandlerCache;
    }

    const originalPromise = this.handlerPromise;
    if (originalPromise) {
      console.debug('getCreditCardHandler originalPromise exists, chainging', this.identifier);
      this.handlerPromise = new Promise(resolve => {
        console.debug('getCreditCardHandler inside chained callback', this.identifier);
        originalPromise.then(handler => {
          console.debug('getCreditCardHandler original promise resolved, resolving second callback', this.identifier, handler);
          resolve(handler);
        });
      });
      return this.handlerPromise;
    }

    console.debug('getCreditCardHandler NO originalPromise, setting up handler', this.identifier);
    this.handlerPromise = this.paymentClients.getHostedFields().then(client => {
      console.debug('getCreditCardHandler NO originalPromise, inside getHostedField', this.identifier);
      this.creditCardHandlerCache = new CreditCardHandler({
        braintreeManager: this.braintreeManager,
        hostedFieldClient: client,
        hostedFieldConfig: this.hostedFieldConfig,
      });

      console.debug('getCreditCardHandler NO originalPromise, returning CACHE', this.identifier, this.creditCardHandlerCache);
      return this.creditCardHandlerCache;
    })

    // const config = new H

    console.debug('getCreditCardHandler NO originalPromise, RETURNING ORIGINAL PROMISE', this.identifier);
    return this.handlerPromise;
  }

  async getApplePayHandler(): Promise<ApplePayHandlerInterface> {
    console.debug('getApplePayHandler start');

    if (this.applePayHandlerCache) {
      console.debug('getApplePayHandler, handler cached');
      return this.applePayHandlerCache;
    }

    const client = await this.paymentClients.getApplePay();

    console.debug('getApplePayHandler, client', client);

    const applePaySessionManager = new ApplePaySessionManager();
    this.applePayHandlerCache = new ApplePayHandler(
      this.braintreeManager,
      client,
      applePaySessionManager,
    );

    console.debug('getApplePayHandler done', client, this.applePayHandlerCache);

    return this.applePayHandlerCache;
  }

  async getVenmoHandler(): Promise<VenmoHandlerInterface | undefined> {
    console.debug('getVenmoHandler start');
    if (!this.venmoProfileId) {
      return undefined;
    }

    if (this.venmoHandlerCache) {
      return this.venmoHandlerCache;
    }

    const client = await this.paymentClients.getVenmo();

    this.venmoHandlerCache = new VenmoHandler({
      braintreeManager: this.braintreeManager,
      venmoClient: client,
      venmoProfileId: this.venmoProfileId,
    });

    console.debug('getVenmoHandler done', client, this.venmoHandlerCache);

    return this.venmoHandlerCache;
  }

  async getPaypalHandler(): Promise<PayPalHandlerInterface> {
    if (this.paypalHandlerCache) {
      return this.paypalHandlerCache;
    }

    const paypalLibrary = await this.paymentClients.getPaypalLibrary();
    const client = await this.paymentClients.getPayPal();

    this.paypalHandlerCache = new PayPalHandler(
      this.braintreeManager,
      client,
      paypalLibrary,
      this.hostingEnvironment,
    );

    console.log(this.paymentClients.getPayPal, paypalLibrary, this.paypalHandlerCache);
    return this.paypalHandlerCache;
  }

  async getGooglePayHandler(): Promise<GooglePayHandlerInterface> {
    if (this.googlePayHandlerCache) {
      return this.googlePayHandlerCache;
    }

    const googlePaymentsClient = await this.paymentClients.getGooglePaymentsClient();
    const braintreeClient = await this.paymentClients.getGooglePayBraintreeClient();

    this.googlePayHandlerCache = new GooglePayHandler({
      braintreeManager: this.braintreeManager,
      googlePayMerchantId: this.googlePayMerchantId,
      googlePayBraintreeClient: braintreeClient,
      googlePaymentsClient: googlePaymentsClient,
    });

    console.log(this.googlePayHandlerCache);
    return this.googlePayHandlerCache;
  }

  private braintreeManager: BraintreeManagerInterface;

  private venmoProfileId?: string;

  private googlePayMerchantId?: string;

  private creditCardHandlerCache?: CreditCardHandlerInterface;

  private applePayHandlerCache?: ApplePayHandlerInterface;

  private venmoHandlerCache?: VenmoHandlerInterface;

  private paypalHandlerCache?: PayPalHandlerInterface;

  private googlePayHandlerCache?: GooglePayHandlerInterface;

  private hostedFieldConfig: HostedFieldConfiguration;

  private hostingEnvironment: HostingEnvironment = HostingEnvironment.Development;

  private paymentClients: PaymentClientsInterface;

  private identifier: number;

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
    this.identifier = Math.random() * 1000;
  }
}
