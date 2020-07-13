import { PaymentProvidersInterface } from './payment-providers';
import { DonationRequest } from '../models/request-models/donation-request';
import { DonationResponse } from '../models/response-models/donation-response';
import { SuccessResponse } from '../models/response-models/success-models/success-response';
import { PromisedSingleton } from '../util/promised-singleton';

export interface BraintreeManagerInterface {
  paymentProviders: PaymentProvidersInterface;
  deviceData: string | undefined;
  instance: PromisedSingleton<braintree.Client>;

  startup(): void;
  submitDataToEndpoint(request: DonationRequest): Promise<DonationResponse>;
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
