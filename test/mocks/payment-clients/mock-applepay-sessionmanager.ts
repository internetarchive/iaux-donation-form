import { ApplePaySessionManagerInterface } from '../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-session-manager';

export class MockApplePaySessionManager implements ApplePaySessionManagerInterface {
  canMakePayments(): boolean {
    return this.makePayments;
  }
  createNewPaymentSession(paymentRequest: ApplePayJS.ApplePayPaymentRequest): ApplePaySession {
    throw new Error("Method not implemented.");
  }

  constructor(options: {
    canMakePayments: boolean;
  }) {
    this.makePayments = options.canMakePayments;
  }

  private makePayments: boolean;
}
