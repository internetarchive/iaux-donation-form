/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayPalCheckoutCreatePaymentOptions } from 'braintree-web';
import { PayPalCheckoutTokenizationOptions } from 'braintree-web/modules/paypal-checkout';

export class MockPayPalClient implements braintree.PayPalCheckout {
  async create(options: {
    client?: braintree.Client | undefined;
    authorization?: string | undefined;
    merchantAccountId?: string | undefined;
  }): Promise<braintree.PayPalCheckout> {
    return new MockPayPalClient();
  }
  VERSION = 'foo';
  createPayment(
    options: PayPalCheckoutCreatePaymentOptions,
    callback?: braintree.callback | undefined,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async tokenizePayment(
    tokenizeOptions: PayPalCheckoutTokenizationOptions,
  ): Promise<paypal.TokenizePayload> {
    class Payload implements paypal.TokenizePayload {
      nonce = 'foo-nonce';
      type = 'foo-type';
      details = {
        email: 'foo@bar.com',
        payerId: '12354',
        firstName: 'Foo',
        lastName: 'Bar',
        countryCode: 'US',
        phone: '123-456-7890',
      };
    }

    const payload = new Payload();

    return payload;
  }

  async getClientId(): Promise<string> {
    return 'foo';
  }

  async startVaultInitiatedCheckout(options: { optOutOfModalBackdrop: boolean }): Promise<void> {
    return;
  }

  async teardown(): Promise<void> {
    return;
  }
}
