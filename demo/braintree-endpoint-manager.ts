/* eslint-disable @typescript-eslint/camelcase */
import { submitFormWith } from './submit-form-with';

import {
  SuccessResponse,
  DonationRequest,
  DonationResponse,
  BraintreeEndpointManagerInterface,
} from '../index';

export class BraintreeEndpointManager implements BraintreeEndpointManagerInterface {
  async submitData(request: DonationRequest): Promise<DonationResponse> {
    const response = await fetch(
      'https://review-1963.archive.org/services/donations/braintree-charge.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(request),
      },
    );
    const json = await response.json();
    return json;
  }

  donationSuccessful(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse;
  }): void {
    const upsellAmount = options.upsellSuccessResponse?.amount;
    const upsellChargeId = options.upsellSuccessResponse?.transaction_id;

    const payload: { [key: string]: string | undefined } = {
      amount: `${options.successResponse.amount}`,
      'charge-id': options.successResponse.transaction_id,
      'donation-type': options.upsellSuccessResponse
        ? 'upsell'
        : options.successResponse.donationType,
      first_name: options.successResponse.customer.firstName,
      last_name: options.successResponse.customer.lastName,
      email: options.successResponse.customer.email,
      'upsell-amount': `${upsellAmount}`,
      'upsell-charge-id': upsellChargeId,
    };

    submitFormWith({
      action: `https://review-1963.archive.org/services/donate.php?service=PayPal`,
      fields: payload,
    });
  }
}
