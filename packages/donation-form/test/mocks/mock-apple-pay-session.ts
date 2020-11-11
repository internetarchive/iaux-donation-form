/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockApplePaySession implements ApplePaySession {
  oncancel: (event: ApplePayJS.Event) => void = () => {
    console.log('oncancel');
  };
  onpaymentauthorized: (event: ApplePayJS.ApplePayPaymentAuthorizedEvent) => void = () => {
    console.log('onpaymentauthorized');
  };
  onpaymentmethodselected: (event: ApplePayJS.ApplePayPaymentMethodSelectedEvent) => void = () => {
    console.log('onpaymentmethodselected');
  };
  onshippingcontactselected: (
    event: ApplePayJS.ApplePayShippingContactSelectedEvent,
  ) => void = () => {
    console.log('onshippingcontactselected');
  };
  onshippingmethodselected: (
    event: ApplePayJS.ApplePayShippingMethodSelectedEvent,
  ) => void = () => {
    console.log('onshippingmethodselected');
  };
  onvalidatemerchant: (event: ApplePayJS.ApplePayValidateMerchantEvent) => void = () => {
    console.log('onvalidatemerchant');
  };
  abort(): void {
    throw new Error('Method not implemented.');
  }
  begin(): void {
    throw new Error('Method not implemented.');
  }
  completeMerchantValidation(merchantSession: any): void {
    throw new Error('Method not implemented.');
  }
  completePayment(result: number | ApplePayJS.ApplePayPaymentAuthorizationResult): void {
    throw new Error('Method not implemented.');
  }
  completePaymentMethodSelection(
    newTotal: ApplePayJS.ApplePayLineItem,
    newLineItems: ApplePayJS.ApplePayLineItem[],
  ): void;
  completePaymentMethodSelection(update: ApplePayJS.ApplePayPaymentMethodUpdate): void;
  completePaymentMethodSelection(newTotal: any, newLineItems?: any): void {
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
  ): void {
    throw new Error('Method not implemented.');
  }
  completeShippingMethodSelection(
    status: number,
    newTotal: ApplePayJS.ApplePayLineItem,
    newLineItems: ApplePayJS.ApplePayLineItem[],
  ): void;
  completeShippingMethodSelection(update: ApplePayJS.ApplePayShippingMethodUpdate): void;
  completeShippingMethodSelection(status: any, newTotal?: any, newLineItems?: any): void {
    throw new Error('Method not implemented.');
  }
  addEventListener(
    type: string,
    listener: EventListener | EventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void {
    throw new Error('Method not implemented.');
  }
  dispatchEvent(event: Event): boolean {
    throw new Error('Method not implemented.');
  }
  removeEventListener(
    type: string,
    callback: EventListener | EventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void {
    throw new Error('Method not implemented.');
  }
}
