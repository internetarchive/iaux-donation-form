import { PaymentProvidersInterface } from "./payment-providers";
import { DonationRequest } from "../models/request_models/donation-request";
import { DonationResponse } from "../models/response-models/donation-response";

export interface BraintreeManagerInterface {
  paymentProviders: PaymentProvidersInterface;
  deviceData: string | undefined;

  startup(): void;
  getInstance(): Promise<braintree.Client | undefined>;
  submitDataToEndpoint(request: DonationRequest): Promise<DonationResponse>;
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
}

export enum HostingEnvironment {
  Development = 'dev',
  Production = 'prod',
}
