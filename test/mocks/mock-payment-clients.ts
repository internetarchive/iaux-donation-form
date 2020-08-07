/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentClientsInterface } from '../../src/braintree-manager/payment-clients';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { MockBraintreeClient } from './payment-clients/mock-braintree-client';
import { MockDeviceDataCollector } from './payment-clients/mock-data-collector';
import { MockHostedFieldsClient } from './payment-clients/mock-hostedfields-client';
import { MockVenmoClient } from './payment-clients/mock-venmo-client';
import { MockPayPalClient } from './payment-clients/mock-paypal-client';
import { MockApplePayClient } from './payment-clients/mock-applepay-client';
import { MockGooglePaymentClient } from './payment-clients/mock-googlepay-client';
import { MockGooglePayLibrary } from './payment-clients/mock-googlepay-library';

export class MockPaymentClients implements PaymentClientsInterface {
  async emitValidityChangedEvent(valid: boolean): Promise<void> {
    const hostedFields = (await this.hostedFields.get()) as MockHostedFieldsClient;
    hostedFields.emitValidityChangedEvent(valid);
  }

  braintreeClient: PromisedSingleton<braintree.Client>;
  dataCollector: PromisedSingleton<braintree.DataCollector>;
  hostedFields: PromisedSingleton<braintree.HostedFields>;
  venmo: PromisedSingleton<braintree.Venmo>;
  payPal: PromisedSingleton<braintree.PayPalCheckout>;
  applePay: PromisedSingleton<braintree.ApplePay>;
  googlePayBraintreeClient: PromisedSingleton<braintree.GooglePayment>;
  googlePaymentsClient: PromisedSingleton<google.payments.api.PaymentsClient>;
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
          const client = new MockHostedFieldsClient();
          resolve(client);
        }),
      });
    this.venmo =
      generators?.venmo ??
      new PromisedSingleton<braintree.Venmo>({
        generator: new Promise((resolve, reject) => {
          resolve(new MockVenmoClient({ isBrowserSupported: true }));
        }),
      });
    this.payPal =
      generators?.payPal ??
      new PromisedSingleton<braintree.PayPalCheckout>({
        generator: new Promise((resolve, reject) => {
          resolve(new MockPayPalClient());
        }),
      });
    this.applePay =
      generators?.applePay ??
      new PromisedSingleton<braintree.ApplePay>({
        generator: new Promise((resolve, reject) => {
          resolve(new MockApplePayClient());
        }),
      });
    this.googlePayBraintreeClient =
      generators?.googlePayBraintreeClient ??
      new PromisedSingleton<braintree.GooglePayment>({
        generator: new Promise((resolve, reject) => {
          resolve(new MockGooglePaymentClient());
        }),
      });
    this.googlePaymentsClient =
      generators?.googlePaymentsClient ??
      new PromisedSingleton<google.payments.api.PaymentsClient>({
        generator: new Promise((resolve, reject) => {
          resolve(new MockGooglePayLibrary({ isReadyToPay: true }));
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
