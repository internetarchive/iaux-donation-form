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
  private creditCardHandlerPromise?: Promise<CreditCardHandlerInterface>;

  async getCreditCardHandler(): Promise<CreditCardHandlerInterface> {
    if (this.creditCardHandlerCache) {
      return this.creditCardHandlerCache;
    }

    if (this.creditCardHandlerPromise) {
      this.creditCardHandlerPromise = this.creditCardHandlerPromise.then(handler => { return handler });
      return this.creditCardHandlerPromise;
    }

    this.creditCardHandlerPromise = this.paymentClients.getHostedFields()
      .then(client => {
        this.creditCardHandlerCache = new CreditCardHandler({
          braintreeManager: this.braintreeManager,
          hostedFieldClient: client,
          hostedFieldConfig: this.hostedFieldConfig,
        });
        return this.creditCardHandlerCache;
      });

    return this.creditCardHandlerPromise;
  }

  private applePayHandlerPromise?: Promise<ApplePayHandlerInterface>;

  async getApplePayHandler(): Promise<ApplePayHandlerInterface> {
    if (this.applePayHandlerCache) {
      return this.applePayHandlerCache;
    }

    if (this.applePayHandlerPromise) {
      this.applePayHandlerPromise = this.applePayHandlerPromise.then(handler => { return handler });
      return this.applePayHandlerPromise;
    }

    const applePaySessionManager = new ApplePaySessionManager();
    this.applePayHandlerPromise = this.paymentClients.getApplePay()
      .then(client => {
        this.applePayHandlerCache = new ApplePayHandler(
          this.braintreeManager,
          client,
          applePaySessionManager,
        );
        return this.applePayHandlerCache;
      });

    return this.applePayHandlerPromise;
  }

  private venmoHandlerPromise?: Promise<VenmoHandlerInterface | undefined>;

  async getVenmoHandler(): Promise<VenmoHandlerInterface | undefined> {
    if (!this.venmoProfileId) {
      return undefined;
    }

    if (this.venmoHandlerCache) {
      return this.venmoHandlerCache;
    }

    if (this.venmoHandlerPromise) {
      this.venmoHandlerPromise = this.venmoHandlerPromise.then(handler => { return handler });
      return this.venmoHandlerPromise;
    }

    this.venmoHandlerPromise = this.paymentClients.getVenmo()
      .then(client => {
        if (!this.venmoProfileId) { return undefined; }
        this.venmoHandlerCache = new VenmoHandler({
          braintreeManager: this.braintreeManager,
          venmoClient: client,
          venmoProfileId: this.venmoProfileId,
        });
        return this.venmoHandlerCache;
      });

    return this.venmoHandlerPromise;
  }

  private paypalHandlerPromise?: Promise<PayPalHandlerInterface>;

  async getPaypalHandler(): Promise<PayPalHandlerInterface> {
    if (this.paypalHandlerCache) {
      return this.paypalHandlerCache;
    }

    if (this.paypalHandlerPromise) {
      this.paypalHandlerPromise = this.paypalHandlerPromise.then(handler => { return handler });
      return this.paypalHandlerPromise;
    }

    const paypalLibrary = this.paymentClients.getPaypalLibrary();
    const client = this.paymentClients.getPayPal();

    this.paypalHandlerPromise = Promise.all([client, paypalLibrary])
      .then(values => {
        this.paypalHandlerCache = new PayPalHandler({
          braintreeManager: this.braintreeManager,
          paypalClient: values[0],
          paypalLibrary: values[1],
          hostingEnvironment: this.hostingEnvironment,
        });
        return this.paypalHandlerCache;
      })

    return this.paypalHandlerPromise;
  }

  private googlePayHandlerPromise?: Promise<GooglePayHandlerInterface>;

  async getGooglePayHandler(): Promise<GooglePayHandlerInterface> {
    if (this.googlePayHandlerCache) {
      return this.googlePayHandlerCache;
    }

    if (this.googlePayHandlerPromise) {
      this.googlePayHandlerPromise = this.googlePayHandlerPromise.then(handler => { return handler });
      return this.googlePayHandlerPromise;
    }

    const googlePaymentsClient = this.paymentClients.getGooglePaymentsClient();
    const braintreeClient = this.paymentClients.getGooglePayBraintreeClient();

    this.googlePayHandlerPromise = Promise.all([braintreeClient, googlePaymentsClient])
      .then(values => {
        this.googlePayHandlerCache = new GooglePayHandler({
          braintreeManager: this.braintreeManager,
          googlePayMerchantId: this.googlePayMerchantId,
          googlePayBraintreeClient: values[0],
          googlePaymentsClient: values[1],
        });
        return this.googlePayHandlerCache
      })

    return this.googlePayHandlerPromise;
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
