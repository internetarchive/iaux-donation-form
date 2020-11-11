import { MockApplePayPayment } from './payment-clients/mock-applepay-payment';

export class MockApplePayAuthorizedEvent extends ApplePayJS.ApplePayPaymentAuthorizedEvent {
  readonly payment: ApplePayJS.ApplePayPayment = new MockApplePayPayment();
}
