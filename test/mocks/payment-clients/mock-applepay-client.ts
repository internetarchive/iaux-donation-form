/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplePayPaymentRequest } from 'braintree-web/modules/apple-pay';
import { BraintreeError } from 'braintree-web';

export class MockApplePayClient implements braintree.ApplePay {
  private shouldValidateMerchant = true;
  private shouldTokenizeSuccessfully = true;

  constructor(options?: {
    shouldValidateMerchant?: boolean;
    shouldTokenizeSuccessfully?: boolean;
  }) {
    this.shouldValidateMerchant = options?.shouldValidateMerchant ?? true;
    this.shouldTokenizeSuccessfully = options?.shouldTokenizeSuccessfully ?? true;
  }

  async create(options: { client: braintree.Client }): Promise<braintree.ApplePay> {
    return new MockApplePayClient();
  }

  VERSION = 'foo';

  createPaymentRequest(paymentRequest: ApplePayPaymentRequest): ApplePayJS.ApplePayPaymentRequest {
    return {
      total: {
        label: 'Foo Donation',
        amount: '3.50',
      },
      countryCode: 'US',
      currencyCode: 'USD',
      supportedNetworks: ['Foo', 'Bar'],
      merchantCapabilities: [],

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
    if (this.shouldValidateMerchant) {
      callback(undefined, { foo: 'bar' });
    } else {
      const error: BraintreeError = {
        code: 'foo',
        message: 'bar',
        type: 'CUSTOMER',
        details: 'foo bar',
      };
      callback(error, undefined);
    }
  }

  async tokenize(options: { token: any }, callback?: braintree.callback): Promise<any> {
    if (this.shouldTokenizeSuccessfully) {
      if (callback) {
        callback(undefined, { foo: 'bar' });
      } else {
        return { foo: 'bar' };
      }
    } else {
      const error: BraintreeError = {
        code: 'foo',
        message: 'bar',
        type: 'CUSTOMER',
        details: 'foo bar',
      };
      if (callback) {
        callback(error, undefined);
      } else {
        throw error;
      }
    }
  }
}
