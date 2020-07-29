/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentClientsInterface } from '../../src/braintree-manager/payment-clients';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import {
  Client,
  DataCollector,
  HostedFields,
  Venmo,
  PayPalCheckout,
  ApplePay,
  GooglePayment,
} from 'braintree-web';
import { MockBraintreeClient } from './payment-clients/mock-braintree-client';
import { MockDeviceDataCollector } from './payment-clients/mock-data-collector';

export class MockPaymentClients implements PaymentClientsInterface {
  braintreeClient: PromisedSingleton<Client>;
  dataCollector: PromisedSingleton<DataCollector>;
  hostedFields: PromisedSingleton<HostedFields>;
  venmo: PromisedSingleton<Venmo>;
  payPal: PromisedSingleton<PayPalCheckout>;
  applePay: PromisedSingleton<ApplePay>;
  googlePayBraintreeClient: PromisedSingleton<GooglePayment>;
  googlePaymentsClient: PromisedSingleton<google.payments.api.PaymentsClient>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paypalLibrary: PromisedSingleton<any>;

  constructor(generators?: {
    client?: PromisedSingleton<Client>;
    dataCollector?: PromisedSingleton<DataCollector>;
    hostedFields?: PromisedSingleton<HostedFields>;
    venmo?: PromisedSingleton<Venmo>;
    payPal?: PromisedSingleton<PayPalCheckout>;
    applePay?: PromisedSingleton<ApplePay>;
    googlePayBraintreeClient?: PromisedSingleton<GooglePayment>;
    googlePaymentsClient?: PromisedSingleton<google.payments.api.PaymentsClient>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paypalLibrary?: PromisedSingleton<any>;
  }) {
    this.braintreeClient =
      generators?.client ??
      new PromisedSingleton<Client>({
        generator: new Promise((resolve, reject) => {
          resolve(new MockBraintreeClient());
        }),
      });
    this.dataCollector =
      generators?.dataCollector ??
      new PromisedSingleton<DataCollector>({
        generator: new Promise((resolve, reject) => {
          resolve(new MockDeviceDataCollector());
        }),
      });
    this.hostedFields =
      generators?.hostedFields ??
      new PromisedSingleton<HostedFields>({
        generator: new Promise((resolve, reject) => {
          reject('Not implemented');
        }),
      });
    this.venmo =
      generators?.venmo ??
      new PromisedSingleton<Venmo>({
        generator: new Promise((resolve, reject) => {
          reject('Not implemented');
        }),
      });
    this.payPal =
      generators?.payPal ??
      new PromisedSingleton<PayPalCheckout>({
        generator: new Promise((resolve, reject) => {
          reject('Not implemented');
        }),
      });
    this.applePay =
      generators?.applePay ??
      new PromisedSingleton<ApplePay>({
        generator: new Promise((resolve, reject) => {
          reject('Not implemented');
        }),
      });
    this.googlePayBraintreeClient =
      generators?.googlePayBraintreeClient ??
      new PromisedSingleton<GooglePayment>({
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
