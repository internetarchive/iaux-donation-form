/* eslint-disable @typescript-eslint/no-unused-vars */
import { MockApplePayPayment } from './mock-applepay-payment';

export class MockApplePayPaymentAuthorizedEvent
  implements ApplePayJS.ApplePayPaymentAuthorizedEvent {
  payment: ApplePayJS.ApplePayPayment = new MockApplePayPayment();
  bubbles = true;
  cancelBubble = true;
  cancelable = true;
  composed = true;
  currentTarget: EventTarget = new EventTarget();
  defaultPrevented = false;
  eventPhase = 1;
  isTrusted = true;
  returnValue = true;
  srcElement: EventTarget = new EventTarget();
  target: EventTarget = new EventTarget();
  timeStamp = '1234';
  type = 'foo';
  composedPath(): Node[] {
    throw new Error('Method not implemented.');
  }
  initEvent(
    type?: string | undefined,
    bubbles?: boolean | undefined,
    cancelable?: boolean | undefined,
  ): void {
    throw new Error('Method not implemented.');
  }
  preventDefault(): void {
    throw new Error('Method not implemented.');
  }
  stopImmediatePropagation(): void {
    throw new Error('Method not implemented.');
  }
  stopPropagation(): void {
    throw new Error('Method not implemented.');
  }
}
