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
    const response = options.successResponse;
    const upsellResponse = options.upsellSuccessResponse;

    const upsellAmount = upsellResponse?.amount;
    const upsellChargeId = upsellResponse?.transaction_id;

    const payload: { [key: string]: string | undefined } = {
      amount: `${response.amount}`,
      'charge-id': response.transaction_id,
      'donation-type': upsellResponse
        ? 'upsell'
        : response.donationType,
      first_name: response.customer.firstName,
      last_name: response.customer.lastName,
      email: response.customer.email,
      'upsell-amount': `${upsellAmount}`,
      'upsell-charge-id': upsellChargeId,
    };

    const service = encodeURI(response.paymentProvider);

    submitFormWith({
      action: `https://review-1963.archive.org/services/donate.php?service=${service}`,
      fields: payload,
    });
  }
}
