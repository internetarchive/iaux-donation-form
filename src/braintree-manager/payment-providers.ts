import { CreditCardHandlerInterface, CreditCardHandler } from './payment-providers/credit-card';
import { ApplePayHandlerInterface, ApplePayHandler } from './payment-providers/apple-pay/apple-pay';
import { VenmoHandlerInterface, VenmoHandler } from './payment-providers/venmo';
import { PayPalHandlerInterface, PayPalHandler } from './payment-providers/paypal/paypal';
import { ApplePaySessionManager } from './payment-providers/apple-pay/apple-pay-session-manager';
import { PaymentClientsInterface } from './payment-clients';
import { GooglePayHandlerInterface, GooglePayHandler } from './payment-providers/google-pay';
import { BraintreeManagerInterface, HostingEnvironment } from './braintree-interfaces';

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
  async getCreditCardHandler(): Promise<CreditCardHandlerInterface> {
    if (this.creditCardHandlerCache) {
      return this.creditCardHandlerCache;
    }

    const client = await this.paymentClients.getHostedFields();

    this.creditCardHandlerCache = new CreditCardHandler(
      this.braintreeManager,
      client,
      this.hostedFieldStyle,
      this.hostedFieldConfig,
    );

    return this.creditCardHandlerCache;
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

  private hostedFieldStyle: object;

  private hostedFieldConfig: braintree.HostedFieldFieldOptions;

  private hostingEnvironment: HostingEnvironment = HostingEnvironment.Development;

  private paymentClients: PaymentClientsInterface;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    paymentClients: PaymentClientsInterface;
    venmoProfileId?: string;
    googlePayMerchantId?: string;
    hostingEnvironment: HostingEnvironment;
    hostedFieldStyle: object;
    hostedFieldConfig: braintree.HostedFieldFieldOptions;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.venmoProfileId = options.venmoProfileId;
    this.googlePayMerchantId = options.googlePayMerchantId;
    this.paymentClients = options.paymentClients;
    this.hostingEnvironment = options.hostingEnvironment;
    this.hostedFieldStyle = options.hostedFieldStyle;
    this.hostedFieldConfig = options.hostedFieldConfig;
  }
}
