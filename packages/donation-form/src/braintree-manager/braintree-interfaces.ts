import {
  DonationRequest,
  DonationResponse,
  SuccessResponse,
  PaymentProvider,
  DonationPaymentInfo,
  CustomerInfo,
  BillingInfo,
} from '@internetarchive/donation-form-data-models';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { Unsubscribe } from 'nanoevents';
import { PaymentProvidersInterface } from './payment-providers-interface';

export interface BraintreeManagerEvents {
  paymentProvidersHostedFieldsRetry: (retryNumber: number) => void;
  paymentProvidersHostedFieldsFailed: (error: unknown) => void;
}

/**
 * The BraintreeManager is the main entrypoint for much of the common braintree functionality.
 *
 * A single instance of it gets created and passed down through all of the components.
 *
 * @export
 * @interface BraintreeManagerInterface
 */
export interface BraintreeManagerInterface {
  on<E extends keyof BraintreeManagerEvents>(
    event: E,
    callback: BraintreeManagerEvents[E],
  ): Unsubscribe;

  /**
   * The PaymentProviders class contains the IA-specific handlers for each of the
   * different payment providers.
   *
   * They are generally data-focused, as opposed to UI-focused, but there
   * is some cross-polination between PaymentProviders and FlowHandlers.
   *
   * @type {PaymentProvidersInterface}
   * @memberof BraintreeManagerInterface
   */
  paymentProviders: PaymentProvidersInterface;

  /**
   * The Braintree Client instance.
   *
   * This gets used to isntantiate clients for all of the payment providers.
   *
   * @type {PromisedSingleton<braintree.Client>}
   * @memberof BraintreeManagerInterface
   */
  instance: PromisedSingleton<braintree.Client>;

  /**
   * Set the referrer for later submission
   *
   * @param {string} referrer
   * @memberof BraintreeManagerInterface
   */
  setReferrer(referrer: string): void;

  /**
   * Set the origin for later submission
   *
   * @param {string} origin
   * @memberof BraintreeManagerInterface
   */
  setOrigin(origin: string): void;

  /**
   * Set the logged-in user for later submission
   *
   * @param {string} loggedInUser
   * @memberof BraintreeManagerInterface
   */
  setLoggedInUser(loggedInUser: string): void;

  /**
   * Perform startup tasts like session resuming
   *
   * @memberof BraintreeManagerInterface
   */
  startup(): void;

  /**
   * Submit donation to the backend
   *
   * @param {{
   *     nonce: string;
   *     paymentProvider: PaymentProvider;
   *     donationInfo: DonationPaymentInfo;
   *     billingInfo: BillingInfo;
   *     customerInfo: CustomerInfo;
   *     upsellOnetimeTransactionId?: string;
   *     customerId?: string;
   *     recaptchaToken?: string;
   *     bin?: string; // first 6 digits of CC
   *     binName?: string; // credit card bank name
   *   }} options
   * @returns {Promise<DonationResponse>}
   * @memberof BraintreeManagerInterface
   */
  submitDonation(options: {
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
  }): Promise<DonationResponse>;

  /**
   * Submit the upsell donation
   *
   * @param {{
   *     oneTimeDonationResponse: SuccessResponse;
   *     amount: number;
   *   }} options
   * @returns {Promise<DonationResponse>}
   * @memberof BraintreeManagerInterface
   */
  submitUpsellDonation(options: {
    oneTimeDonationResponse: SuccessResponse;
    amount: number;
  }): Promise<DonationResponse>;

  /**
   * Finish the donation after a successful completion.
   *
   * @param {{
   *     successResponse: SuccessResponse;
   *     upsellSuccessResponse?: SuccessResponse;
   *   }} options
   * @memberof BraintreeManagerInterface
   */
  donationSuccessful(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse;
  }): void;
}

export interface BraintreeEndpointManagerInterface {
  /**
   * Responsible for submitting a data object to the backend
   * and returning a Promise of the JSON object response.
   *
   * @param {object} data
   * @returns {Promise<object>}
   * @memberof BraintreeEndpointManagerInterface
   */
  submitData(request: DonationRequest): Promise<DonationResponse>;

  /**
   * Once the user is finished with the donation flow, either after
   * a monthly donation or an upsell, we notify the endpoint manager
   * so it can redirect the user to the thank you page.
   */
  donationSuccessful(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse;
  }): void;
}

export enum HostingEnvironment {
  Development = 'dev',
  Production = 'prod',
}
