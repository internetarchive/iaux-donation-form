import { ApplePaySessionManagerInterface } from '../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-session-manager';
import { MockApplePaySession } from './mock-applepay-session';

export class MockApplePaySessionManager implements ApplePaySessionManagerInterface {
  canMakePayments(): boolean {
    return this.makePayments;
  }

  createNewPaymentSession(paymentRequest: ApplePayJS.ApplePayPaymentRequest): ApplePaySession {
    return new MockApplePaySession();
  }

  constructor(options: {
    canMakePayments: boolean;
  }) {
    this.makePayments = options.canMakePayments;
  }

  private makePayments: boolean;
}
