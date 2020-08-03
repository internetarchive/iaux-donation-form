/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class MockApplePaySession implements ApplePaySession {
  versionCheck: number;
  paymentRequestCheck?: ApplePayJS.ApplePayPaymentRequest;
  completeMerchantValidationCalled = false;
  abortCalled = false;

  constructor(version?: number, paymentRequest?: ApplePayJS.ApplePayPaymentRequest) {
    this.versionCheck = version ?? 3;
    this.paymentRequestCheck = paymentRequest;
  }

  static canMakePayments(): boolean {
    return true;
  }

  static supportsVersion(version: number): boolean {
    return true;
  }

  oncancel: (event: ApplePayJS.Event) => void = (event: ApplePayJS.Event) => {
    console.debug('oncancel', event);
  };

  onpaymentauthorized: (event: ApplePayJS.ApplePayPaymentAuthorizedEvent) => void = (
    event: ApplePayJS.ApplePayPaymentAuthorizedEvent,
  ) => {
    console.debug('onpaymentauthorized', event);
  };

  onpaymentmethodselected: (event: ApplePayJS.ApplePayPaymentMethodSelectedEvent) => void = (
    event: ApplePayJS.ApplePayPaymentMethodSelectedEvent,
  ) => {
    console.debug('onpaymentmethodselected', event);
  };

  onshippingcontactselected: (event: ApplePayJS.ApplePayShippingContactSelectedEvent) => void = (
    event: ApplePayJS.ApplePayShippingContactSelectedEvent,
  ) => {
    console.debug('onshippingcontactselected', event);
  };

  onshippingmethodselected: (event: ApplePayJS.ApplePayShippingMethodSelectedEvent) => void = (
    event: ApplePayJS.ApplePayShippingMethodSelectedEvent,
  ) => {
    console.debug('onshippingmethodselected', event);
  };

  onvalidatemerchant: (event: ApplePayJS.ApplePayValidateMerchantEvent) => void = (
    event: ApplePayJS.ApplePayValidateMerchantEvent,
  ) => {
    console.debug('onvalidatemerchant', event);
  };

  abort(): void {
    this.abortCalled = true;
  }

  begin(): void {
    console.debug('begin');
  }

  completeMerchantValidation(merchantSession: any): void {
    this.completeMerchantValidationCalled = true;
  }

  completePayment(result: number | ApplePayJS.ApplePayPaymentAuthorizationResult): void {
    throw new Error('Method not implemented.');
  }

  completePaymentMethodSelection(
    newTotal: ApplePayJS.ApplePayLineItem,
    newLineItems: ApplePayJS.ApplePayLineItem[],
  ): void;

  completePaymentMethodSelection(update: ApplePayJS.ApplePayPaymentMethodUpdate): void;

  completePaymentMethodSelection(newTotal: any, newLineItems?: any) {
    throw new Error('Method not implemented.');
  }

  completeShippingContactSelection(
    status: number,
    newShippingMethods: ApplePayJS.ApplePayShippingMethod[],
    newTotal: ApplePayJS.ApplePayLineItem,
    newLineItems: ApplePayJS.ApplePayLineItem[],
  ): void;
  completeShippingContactSelection(update: ApplePayJS.ApplePayShippingContactUpdate): void;
  completeShippingContactSelection(
    status: any,
    newShippingMethods?: any,
    newTotal?: any,
    newLineItems?: any,
  ) {
    throw new Error('Method not implemented.');
  }
  completeShippingMethodSelection(
    status: number,
    newTotal: ApplePayJS.ApplePayLineItem,
    newLineItems: ApplePayJS.ApplePayLineItem[],
  ): void;
  completeShippingMethodSelection(update: ApplePayJS.ApplePayShippingMethodUpdate): void;
  completeShippingMethodSelection(status: any, newTotal?: any, newLineItems?: any) {
    throw new Error('Method not implemented.');
  }
  addEventListener(
    type: string,
    listener: EventListener | EventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    throw new Error('Method not implemented.');
  }
  dispatchEvent(event: Event): boolean {
    throw new Error('Method not implemented.');
  }
  removeEventListener(
    type: string,
    callback: EventListener | EventListenerObject | null,
    options?: boolean | EventListenerOptions | undefined,
  ): void {
    throw new Error('Method not implemented.');
  }
}
