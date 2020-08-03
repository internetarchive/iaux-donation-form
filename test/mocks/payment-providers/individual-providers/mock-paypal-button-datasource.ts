import { PayPalButtonDataSourceDelegate, PayPalButtonDataSourceInterface } from '../../../../src/braintree-manager/payment-providers/paypal/paypal-button-datasource';

export class MockPayPalButtonDataSourceDelegate implements PayPalButtonDataSourceDelegate {
  paymentStartedResults: {
    called: boolean;
    datasource?: PayPalButtonDataSourceInterface;
    options?: object;
  } = {
    called: false
  }

  paymentAuthorizedResults: {
    called: boolean;
    datasource?: PayPalButtonDataSourceInterface;
    payload?: paypal.TokenizePayload;
  } = {
    called: false
  }

  paymentCancelledResults: {
    called: boolean;
    datasource?: PayPalButtonDataSourceInterface;
    data?: object;
  } = {
    called: false
  }

  paymentErrorResults: {
    called: boolean;
    datasource?: PayPalButtonDataSourceInterface;
    error?: string;
  } = {
    called: false
  }

  async payPalPaymentStarted(dataSource: PayPalButtonDataSourceInterface, options: object): Promise<void> {
    this.paymentStartedResults.called = true;
    this.paymentStartedResults.datasource = dataSource;
    this.paymentStartedResults.options = options;
  }

  async payPalPaymentAuthorized(dataSource: PayPalButtonDataSourceInterface, payload: paypal.TokenizePayload): Promise<void> {
    this.paymentAuthorizedResults.called = true;
    this.paymentAuthorizedResults.datasource = dataSource;
    this.paymentAuthorizedResults.payload = payload;
  }

  async payPalPaymentCancelled(dataSource: PayPalButtonDataSourceInterface, data: object): Promise<void> {
    this.paymentCancelledResults.called = true;
    this.paymentCancelledResults.datasource = dataSource;
    this.paymentCancelledResults.data = data;
  }

  async payPalPaymentError(dataSource: PayPalButtonDataSourceInterface, error: string): Promise<void> {
    this.paymentErrorResults.called = true;
    this.paymentErrorResults.datasource = dataSource;
    this.paymentErrorResults.error = error;
  }
}
