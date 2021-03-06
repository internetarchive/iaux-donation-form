/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockPayPalClient implements braintree.PayPalCheckout {
  createPaymentResults: {
    called: boolean;
    options?: braintree.PayPalCheckoutCreatePaymentOptions;
  } = {
    called: false,
  };

  tokenizePaymentResults: {
    called: boolean;
    tokenizeOptions?: braintree.PayPalCheckoutTokenizationOptions;
  } = {
    called: false,
  };

  async create(options: {
    client?: braintree.Client | undefined;
    authorization?: string | undefined;
    merchantAccountId?: string | undefined;
  }): Promise<braintree.PayPalCheckout> {
    return this;
  }

  VERSION = 'foo';

  async createPayment(
    options: braintree.PayPalCheckoutCreatePaymentOptions,
    callback?: braintree.callback | undefined,
  ): Promise<string> {
    this.createPaymentResults.called = true;
    this.createPaymentResults.options = options;
    return 'createPaymentCalled';
  }

  async tokenizePayment(
    tokenizeOptions: braintree.PayPalCheckoutTokenizationOptions,
  ): Promise<paypal.TokenizePayload> {
    this.tokenizePaymentResults.called = true;
    this.tokenizePaymentResults.tokenizeOptions = tokenizeOptions;

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
