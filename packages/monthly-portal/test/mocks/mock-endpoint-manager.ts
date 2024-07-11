import { BraintreeEndpointManagerInterface } from '../../src/braintree-manager/braintree-interfaces';
import {
  DonationResponse,
  SuccessResponse,
  DonationRequest,
} from '@internetarchive/donation-form-data-models';
import { mockSuccessResponse } from './models/mock-success-response';

export class MockEndpointManager implements BraintreeEndpointManagerInterface {
  requestSubmitted?: DonationRequest;

  successResponseSubmitted?: SuccessResponse;

  upsellSuccessResponseSubmitted?: SuccessResponse | undefined;

  async submitData(request: DonationRequest): Promise<DonationResponse> {
    this.requestSubmitted = request;
    const response = new DonationResponse({
      success: true,
      value: mockSuccessResponse,
    });
    return response;
  }

  donationSuccessful(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse | undefined;
  }): void {
    this.successResponseSubmitted = options.successResponse;
    this.upsellSuccessResponseSubmitted = options.upsellSuccessResponse;
  }
}
