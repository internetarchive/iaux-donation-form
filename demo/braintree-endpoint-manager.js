import { submitFormWith } from './submit-form-with';

export class BraintreeEndpointManager {
  async submitData(data) {
    console.log('submitData', data);

    const response = await fetch('https://review-1963.archive.org/services/donations/braintree-charge.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })

    console.debug('RESPONSE', response);

    const json = await response.json();

    console.debug('json', json);

    return json;
  }

  donationSuccessful({
    successResponse,
    upsellSuccessResponse
  }) {
    console.debug('donationSuccessful(successResponse)', successResponse);
    console.debug('donationSuccessful(upsellSuccessResponse)', upsellSuccessResponse);

    const payload = {};
    payload.amount = successResponse.amount;
    payload['charge-id'] = successResponse.transaction_id;
    payload['donation-type'] = upsellSuccessResponse ? 'upsell' : successResponse.donationType;
    payload.first_name = successResponse.customer.firstName;
    payload.last_name = successResponse.customer.lastName;
    payload.email = successResponse.customer.email;

    if (upsellSuccessResponse) {
      payload['upsell-amount'] = upsellSuccessResponse.amount;
      payload['upsell-charge-id'] = upsellSuccessResponse.transaction_id;
    }

    console.debug('payload', payload);

    submitFormWith({
      action: `https://review-1963.archive.org/services/donate.php?service=PayPal`,
      fields: payload,
    });
  }
}
