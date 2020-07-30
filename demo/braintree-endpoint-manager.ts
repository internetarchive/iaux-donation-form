/* eslint-disable @typescript-eslint/camelcase */
import { submitFormWith } from './submit-form-with';
import currency from 'currency.js';

import {
  SuccessResponse,
  DonationRequest,
  DonationResponse,
  BraintreeEndpointManagerInterface,
} from '../index';

export class BraintreeEndpointManager implements BraintreeEndpointManagerInterface {
  async submitData(request: DonationRequest): Promise<DonationResponse> {
    const response = await fetch(
      'https://www-jasonb.archive.org/services/donations/braintree-charge.php?debug=true',
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

    const displayAmount = currency(response.amount);

    const payload: { [key: string]: string | undefined } = {
      amount: `${displayAmount}`,
      'charge-id': response.transaction_id,
      'donation-type': upsellResponse ? 'upsell' : response.donationType,
      first_name: response.customer.firstName,
      last_name: response.customer.lastName,
      email: response.customer.email,
    };

    if (upsellResponse) {
      const upsellAmount = upsellResponse.amount;
      const upsellChargeId = upsellResponse.transaction_id;
      const displayUpsellAmount = currency(upsellAmount);
      payload['upsell-amount'] = `${displayUpsellAmount}`;
      payload['upsell-charge-id'] = upsellChargeId;
    }

    const service = encodeURI(response.paymentProvider);

    submitFormWith({
      action: `https://www-jasonb.archive.org/services/donate.php?service=${service}`,
      fields: payload,
    });
  }
}
