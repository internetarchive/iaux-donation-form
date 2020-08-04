/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentClientsInterface } from '../../src/braintree-manager/payment-clients';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { MockBraintreeClient } from './payment-clients/mock-braintree-client';
import { MockDeviceDataCollector } from './payment-clients/mock-data-collector';

export class MockPaymentClients implements PaymentClientsInterface {
  braintreeClient: PromisedSingleton<braintree.Client>;
  dataCollector: PromisedSingleton<braintree.DataCollector>;
  hostedFields: PromisedSingleton<braintree.HostedFields>;
  venmo: PromisedSingleton<braintree.Venmo>;
  payPal: PromisedSingleton<braintree.PayPalCheckout>;
  applePay: PromisedSingleton<braintree.ApplePay>;
  googlePayBraintreeClient: PromisedSingleton<braintree.GooglePayment>;
  googlePaymentsClient: PromisedSingleton<google.payments.api.PaymentsClient>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paypalLibrary: PromisedSingleton<any>;

  constructor(generators?: {
    client?: PromisedSingleton<braintree.Client>;
    dataCollector?: PromisedSingleton<braintree.DataCollector>;
    hostedFields?: PromisedSingleton<braintree.HostedFields>;
    venmo?: PromisedSingleton<braintree.Venmo>;
    payPal?: PromisedSingleton<braintree.PayPalCheckout>;
    applePay?: PromisedSingleton<braintree.ApplePay>;
    googlePayBraintreeClient?: PromisedSingleton<braintree.GooglePayment>;
    googlePaymentsClient?: PromisedSingleton<google.payments.api.PaymentsClient>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paypalLibrary?: PromisedSingleton<any>;
  }) {
    this.braintreeClient =
      generators?.client ??
      new PromisedSingleton<braintree.Client>({
        generator: new Promise((resolve, reject) => {
          resolve(new MockBraintreeClient());
        }),
      });
    this.dataCollector =
      generators?.dataCollector ??
      new PromisedSingleton<braintree.DataCollector>({
        generator: new Promise((resolve, reject) => {
          resolve(new MockDeviceDataCollector());
        }),
      });
    this.hostedFields =
      generators?.hostedFields ??
      new PromisedSingleton<braintree.HostedFields>({
        generator: new Promise((resolve, reject) => {
          reject('Not implemented');
        }),
      });
    this.venmo =
      generators?.venmo ??
      new PromisedSingleton<braintree.Venmo>({
        generator: new Promise((resolve, reject) => {
          reject('Not implemented');
        }),
      });
    this.payPal =
      generators?.payPal ??
      new PromisedSingleton<braintree.PayPalCheckout>({
        generator: new Promise((resolve, reject) => {
          reject('Not implemented');
        }),
      });
    this.applePay =
      generators?.applePay ??
      new PromisedSingleton<braintree.ApplePay>({
        generator: new Promise((resolve, reject) => {
          reject('Not implemented');
        }),
      });
    this.googlePayBraintreeClient =
      generators?.googlePayBraintreeClient ??
      new PromisedSingleton<braintree.GooglePayment>({
        generator: new Promise((resolve, reject) => {
          reject('Not implemented');
        }),
      });
    this.googlePaymentsClient =
      generators?.googlePaymentsClient ??
      new PromisedSingleton<google.payments.api.PaymentsClient>({
        generator: new Promise((resolve, reject) => {
          reject('Not implemented');
        }),
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.paypalLibrary =
      generators?.paypalLibrary ??
      new PromisedSingleton<any>({
        generator: new Promise((resolve, reject) => {
          reject('Not implemented');
        }),
      });
  }
}
