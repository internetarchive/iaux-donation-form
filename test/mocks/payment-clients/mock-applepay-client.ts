/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplePayPaymentRequest } from 'braintree-web/modules/apple-pay';

export class MockApplePayClient implements braintree.ApplePay {
  async create(options: { client: braintree.Client }): Promise<braintree.ApplePay> {
    return new MockApplePayClient();
  }

  VERSION = 'foo';

  createPaymentRequest(paymentRequest: ApplePayPaymentRequest): ApplePayPaymentRequest {
    return {
      total: {
        label: 'Foo Donation',
        amount: '3.50',
      },
      countryCode: 'US',
      currencyCode: 'USD',
      supportedNetworks: ['Foo', 'Bar'],
      merchantCapabilities: ['Foo'],

      requiredBillingContactFields: ['postalAddress'],
      requiredShippingContactFields: ['name', 'email'],
    };
  }

  performValidation(
    options: {
      validationURL: string;
      displayName?: string | undefined;
      merchantIdentifier?: string | undefined;
    },
    callback: braintree.callback,
  ): void {
    throw new Error('Method not implemented.');
  }
  tokenize(options: { token: any }, callback: braintree.callback): void {
    throw new Error('Method not implemented.');
  }
}
