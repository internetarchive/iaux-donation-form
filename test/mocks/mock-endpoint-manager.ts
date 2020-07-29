import { BraintreeEndpointManagerInterface } from '../../src/braintree-manager/braintree-interfaces';
import { DonationResponse } from '../../src/models/response-models/donation-response';
import { SuccessResponse } from '../../src/models/response-models/success-models/success-response';
import { DonationRequest } from '../../src/models/request-models/donation-request';
import { ErrorResponse } from '../../src/models/response-models/error-models/error-response';

export class MockEndpointManager implements BraintreeEndpointManagerInterface {
  requestSubmitted?: DonationRequest;

  successResponseSubmitted?: SuccessResponse;

  upsellSuccessResponseSubmitted?: SuccessResponse | undefined;

  async submitData(request: DonationRequest): Promise<DonationResponse> {
    this.requestSubmitted = request;
    // it doesn't matter if it's success or not, error responses are just easier to build
    const errorResponse = new ErrorResponse({
      message: 'foo',
    });
    const response = new DonationResponse({
      success: false,
      value: errorResponse,
    });
    return response;
  }

  donationSuccessful(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse | undefined;
  }): void {
    this.successResponseSubmitted = options.successResponse;
    this.upsellSuccessResponseSubmitted = options.upsellSuccessResponse
  }
}
