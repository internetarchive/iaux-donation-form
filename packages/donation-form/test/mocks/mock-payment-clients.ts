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
import { MockGrecaptcha, MockGrecaptchaMode } from './payment-clients/mock-grecaptcha';
import { MockPaypalLibrary } from './payment-clients/mock-paypal-library';

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
  recaptchaLibrary: PromisedSingleton<ReCaptchaV2.ReCaptcha>;

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
    recaptchaLibrary?: PromisedSingleton<ReCaptchaV2.ReCaptcha>;
  }) {
    this.braintreeClient =
      generators?.client ??
      new PromisedSingleton<braintree.Client>({
        generator: (): Promise<braintree.Client> =>
          new Promise((resolve, reject) => {
            resolve(new MockBraintreeClient());
          }),
      });
    this.dataCollector =
      generators?.dataCollector ??
      new PromisedSingleton<braintree.DataCollector>({
        generator: (): Promise<braintree.DataCollector> =>
          new Promise((resolve, reject) => {
            resolve(new MockDeviceDataCollector());
          }),
      });
    this.hostedFields =
      generators?.hostedFields ??
      new PromisedSingleton<braintree.HostedFields>({
        generator: (): Promise<braintree.HostedFields> =>
          new Promise((resolve, reject) => {
            const client = new MockHostedFieldsClient();
            resolve(client);
          }),
      });
    this.venmo =
      generators?.venmo ??
      new PromisedSingleton<braintree.Venmo>({
        generator: (): Promise<braintree.Venmo> =>
          new Promise((resolve, reject) => {
            resolve(new MockVenmoClient({ isBrowserSupported: true }));
          }),
      });
    this.payPal =
      generators?.payPal ??
      new PromisedSingleton<braintree.PayPalCheckout>({
        generator: (): Promise<braintree.PayPalCheckout> =>
          new Promise((resolve, reject) => {
            resolve(new MockPayPalClient());
          }),
      });
    this.applePay =
      generators?.applePay ??
      new PromisedSingleton<braintree.ApplePay>({
        generator: (): Promise<braintree.ApplePay> =>
          new Promise((resolve, reject) => {
            resolve(new MockApplePayClient());
          }),
      });
    this.googlePayBraintreeClient =
      generators?.googlePayBraintreeClient ??
      new PromisedSingleton<braintree.GooglePayment>({
        generator: (): Promise<braintree.GooglePayment> =>
          new Promise((resolve, reject) => {
            resolve(new MockGooglePaymentClient());
          }),
      });
    this.googlePaymentsClient =
      generators?.googlePaymentsClient ??
      new PromisedSingleton<google.payments.api.PaymentsClient>({
        generator: (): Promise<google.payments.api.PaymentsClient> =>
          new Promise((resolve, reject) => {
            const mockGooglePayLibrary = new MockGooglePayLibrary();
            mockGooglePayLibrary.readyToPay = true;
            resolve(mockGooglePayLibrary);
          }),
      });

    this.paypalLibrary =
      generators?.paypalLibrary ??
      new PromisedSingleton<any>({
        generator: (): Promise<any> =>
          new Promise((resolve, reject) => {
            const mockPayPalLibrary = new MockPaypalLibrary();
            resolve(mockPayPalLibrary);
          }),
      });
    this.recaptchaLibrary =
      generators?.recaptchaLibrary ??
      new PromisedSingleton<ReCaptchaV2.ReCaptcha>({
        generator: (): Promise<ReCaptchaV2.ReCaptcha> =>
          new Promise((resolve, reject) => {
            resolve(new MockGrecaptcha(MockGrecaptchaMode.Success));
          }),
      });
  }
}
