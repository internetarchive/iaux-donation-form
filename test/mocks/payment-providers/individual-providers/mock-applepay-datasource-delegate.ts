/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplePaySessionDataSourceDelegate } from '../../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-session-datasource';
import { DonationResponse } from '../../../../src/models/response-models/donation-response';

export class MockApplePaySessionDataSourceDelegate implements ApplePaySessionDataSourceDelegate {
  paymentCompleteResponse?: DonationResponse;
  paymentFailedError?: any;
  paymentCancelledCalled = false;

  paymentComplete(response: DonationResponse): void {
    this.paymentCompleteResponse = response;
  }
  paymentFailed(error: any): void {
    this.paymentFailedError = error;
  }
  paymentCancelled(): void {
    this.paymentCancelledCalled = true;
  }
}
