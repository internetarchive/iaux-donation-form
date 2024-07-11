/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockGooglePayLibrary implements google.payments.api.PaymentsClient {
  readyToPay = false;

  async isReadyToPay(
    request: google.payments.api.IsReadyToPayRequest,
  ): Promise<google.payments.api.IsReadyToPayResponse> {
    return { result: this.readyToPay };
  }

  createButton(options: google.payments.api.ButtonOptions): HTMLElement {
    throw new Error('Method not implemented.');
  }
  loadPaymentData(
    request: google.payments.api.PaymentDataRequest,
  ): Promise<google.payments.api.PaymentData> {
    throw new Error('Method not implemented.');
  }
  prefetchPaymentData(request: google.payments.api.PaymentDataRequest): void {
    throw new Error('Method not implemented.');
  }

  constructor(paymentOptions?: google.payments.api.PaymentOptions) {
    this.paymentOptions = paymentOptions;
  }

  private paymentOptions?: google.payments.api.PaymentOptions;
}
