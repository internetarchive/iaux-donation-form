import { DonationResponse } from '../models/response-models/donation-response';
import {
  DonationRequest,
  DonationRequestCustomFields,
} from '../models/request-models/donation-request';
import { PaymentProvidersInterface, PaymentProviders } from './payment-providers';
import { PaymentClientsInterface } from './payment-clients';
import {
  BraintreeManagerInterface,
  BraintreeEndpointManagerInterface,
  HostingEnvironment,
} from './braintree-interfaces';
import { SuccessResponse } from '../models/response-models/success-models/success-response';
import { HostedFieldConfiguration } from './payment-providers/credit-card/hosted-field-configuration';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { PaymentProvider } from '../models/common/payment-provider-name';
import { DonationPaymentInfo } from '../models/donation-info/donation-payment-info';
import { BillingInfo } from '../models/common/billing-info';
import { CustomerInfo } from '../models/common/customer-info';
import { DonationType } from '../models/donation-info/donation-type';

/** @inheritdoc */
export class BraintreeManager implements BraintreeManagerInterface {
  private referrer?: string;

  private loggedInUser?: string;

  /**
   * The Device Data token generated by the DataCollector.
   *
   * This gets submitted for several of the payment providers as an anti-fraud mechanism.
   *
   * @private
   * @type {string}
   * @memberof BraintreeManager
   */
  private deviceData?: string;

  /** @inheritdoc */
  paymentProviders: PaymentProvidersInterface;

  /** @inheritdoc */
  async startup(): Promise<void> {
    return this.collectDeviceData();
  }

  /** @inheritdoc */
  instance: PromisedSingleton<braintree.Client>;

  /** @inheritdoc */
  async submitDonation(options: {
    nonce: string;
    paymentProvider: PaymentProvider;
    donationInfo: DonationPaymentInfo;
    billingInfo: BillingInfo;
    customerInfo: CustomerInfo;
    upsellOnetimeTransactionId?: string;
    customerId?: string;
    recaptchaToken?: string;
    bin?: string; // first 6 digits of CC
    binName?: string; // credit card bank name
  }): Promise<DonationResponse> {
    const customFields = new DonationRequestCustomFields();
    // eslint-disable-next-line @typescript-eslint/camelcase
    customFields.fee_amount_covered = options.donationInfo.feeAmountCovered;
    // eslint-disable-next-line @typescript-eslint/camelcase
    customFields.logged_in_user = this.loggedInUser;
    customFields.referrer = this.referrer;

    // we have some special handling in Civi for PayPal so we need to associate
    // the one-time transaction as a customField separately
    if (options.paymentProvider === PaymentProvider.PayPal) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      customFields.paypal_checkout_id = options.upsellOnetimeTransactionId;
    }

    // This is interesting and applies only to Venmo, but will work for other providers as well.
    // In Safari, `donationInfo` actually comes through as a DonationPaymentInfo object,
    // but in Chrome, it comes through as a plain object so you can't call `.total()` on it to
    // get the total amount and instead have to calculate the total
    const total = DonationPaymentInfo.calculateTotal(
      options.donationInfo.amount,
      options.donationInfo.coverFees,
    );

    const donationRequest = new DonationRequest({
      deviceData: this.deviceData,
      paymentProvider: options.paymentProvider,
      paymentMethodNonce: options.nonce,
      amount: total,
      donationType: options.donationInfo.donationType,
      customer: options.customerInfo,
      billing: options.billingInfo,
      customFields: customFields,
      upsellOnetimeTransactionId: options.upsellOnetimeTransactionId,
      customerId: options.customerId,
      recaptchaToken: options.recaptchaToken,
      bin: options.bin,
      binName: options.binName,
    });

    const jsonResponse = await this.endpointManager.submitData(donationRequest);
    const modeledResponse = new DonationResponse(jsonResponse);
    return modeledResponse;
  }

  /** @inheritdoc */
  async submitUpsellDonation(options: {
    oneTimeDonationResponse: SuccessResponse;
    amount: number;
  }): Promise<DonationResponse> {
    const response = options.oneTimeDonationResponse;

    const donationInfo = new DonationPaymentInfo({
      amount: options.amount,
      donationType: DonationType.Upsell,
      coverFees: false,
    });

    return this.submitDonation({
      nonce: response.paymentMethodNonce,
      paymentProvider: response.paymentProvider,
      customerId: response.customer_id,
      donationInfo: donationInfo,
      customerInfo: response.customer,
      billingInfo: response.billing,
      upsellOnetimeTransactionId: response.transaction_id,
    });
  }

  /** @inheritdoc */
  donationSuccessful(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse;
  }): void {
    this.endpointManager.donationSuccessful(options);
  }

  private deviceDataCollectionStarted = false;

  /**
   * Collect Braintree device data. This is used to help fraud detection.
   *
   * @private
   * @returns {Promise<void>}
   * @memberof BraintreeManager
   */
  private async collectDeviceData(): Promise<void> {
    if (this.deviceDataCollectionStarted) {
      return;
    }
    this.deviceDataCollectionStarted = true;

    const instance = await this.instance.get();
    if (!instance) {
      return;
    }

    return this.paymentClients.dataCollector
      .get()
      .then((collector?: braintree.DataCollector) => {
        return collector?.create({ client: instance, kount: false, paypal: true });
      })
      .then(instance => {
        this.deviceData = instance?.deviceData;
      });
  }

  /**
   * Braintree Authorization Token
   *
   * @private
   * @type {string}
   * @memberof BraintreeManager
   */
  private authorizationToken: string;

  /**
   * The endpoint manager for network communications
   *
   * @private
   * @type {BraintreeEndpointManagerInterface}
   * @memberof BraintreeManager
   */
  private endpointManager: BraintreeEndpointManagerInterface;

  /**
   * The payment clients container containing the braintree, paypal, and google clients
   *
   * @private
   * @type {PaymentClientsInterface}
   * @memberof BraintreeManager
   */
  private paymentClients: PaymentClientsInterface;

  private hostingEnvironment: HostingEnvironment = HostingEnvironment.Development;

  constructor(options: {
    authorizationToken: string;
    paymentClients: PaymentClientsInterface;
    endpointManager: BraintreeEndpointManagerInterface;
    hostedFieldConfig: HostedFieldConfiguration;
    hostingEnvironment: HostingEnvironment;
    venmoProfileId?: string;
    googlePayMerchantId?: string;
    referrer?: string;
    loggedInUser?: string;
  }) {
    this.authorizationToken = options.authorizationToken;
    this.endpointManager = options.endpointManager;
    this.hostingEnvironment = options.hostingEnvironment;
    this.paymentClients = options.paymentClients;

    this.referrer = options.referrer;
    this.loggedInUser = options.loggedInUser;

    this.paymentProviders = new PaymentProviders({
      braintreeManager: this,
      paymentClients: this.paymentClients,
      venmoProfileId: options.venmoProfileId,
      googlePayMerchantId: options.googlePayMerchantId,
      hostingEnvironment: options.hostingEnvironment,
      hostedFieldConfig: options.hostedFieldConfig,
    });

    this.instance = new PromisedSingleton<braintree.Client>({
      generator: this.paymentClients.braintreeClient.get().then((client: braintree.Client) => {
        return client?.create({ authorization: this.authorizationToken });
      }),
    });
  }

  /** @inheritdoc */
  setReferrer(referrer: string): void {
    this.referrer = referrer;
  }

  /** @inheritdoc */
  setLoggedInUser(loggedInUser: string): void {
    this.loggedInUser = loggedInUser;
  }
}
