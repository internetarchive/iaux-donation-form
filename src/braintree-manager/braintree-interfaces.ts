import { PaymentProvidersInterface } from './payment-providers';
import { DonationRequest } from '../models/request-models/donation-request';
import { DonationResponse } from '../models/response-models/donation-response';
import { SuccessResponse } from '../models/response-models/success-models/success-response';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { BillingInfo } from '../models/common/billing-info';
import { CustomerInfo } from '../models/common/customer-info';
import { DonationPaymentInfo } from '../models/donation-info/donation-payment-info';
import { PaymentProvider } from '../models/common/payment-provider-name';

export interface BraintreeManagerInterface {
  paymentProviders: PaymentProvidersInterface;
  instance: PromisedSingleton<braintree.Client>;
  setReferrer(referrer: string): void;
  setLoggedInUser(loggedInUser: string): void;

  startup(): void;

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

  submitUpsellDonation(options: {
    oneTimeDonationResponse: SuccessResponse;
    amount: number;
  }): Promise<DonationResponse>;

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
