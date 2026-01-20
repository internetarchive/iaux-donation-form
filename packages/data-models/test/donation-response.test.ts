import { SuccessResponse } from '../src/response-models/success-models/success-response';
import { PaymentProvider } from '../src/common/payment-provider-name';
import { DonationType } from '../src/donation-info/donation-type';
import { CustomerInfo } from '../src/common/customer-info';
import { BillingInfo } from '../src/common/billing-info';
import { DonationResponse } from '../src/response-models/donation-response';
import { expect } from '@open-wc/testing';
import { ErrorResponse } from '../src/response-models/error-models/error-response';

describe('Donation Payment Info', () => {
  it('can initialize with a success response', async () => {
    const successResponse = new SuccessResponse({
      paymentProvider: PaymentProvider.CreditCard,
      paymentMethodNonce: 'foo',
      amount: 12.34,
      donationType: DonationType.OneTime,
      transaction_id: 'bar',
      customer_id: '12345',
      customer: new CustomerInfo(),
      billing: new BillingInfo(),
    });

    const donationResponse = new DonationResponse({
      success: true,
      value: successResponse,
    });

    expect(donationResponse.value instanceof SuccessResponse).to.be.true;
  });

  it('can initialize with an error response', async () => {
    const errorResponse = new ErrorResponse({
      message: 'Foo went bad',
    });

    const donationResponse = new DonationResponse({
      success: false,
      value: errorResponse,
    });

    expect(donationResponse.value instanceof ErrorResponse).to.be.true;
  });
});
