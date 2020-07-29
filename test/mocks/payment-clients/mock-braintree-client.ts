export class MockBraintreeClient implements braintree.Client {
  authorization = 'mock-auth';
  async create(options: { authorization: string }): Promise<braintree.Client> {
    return new MockBraintreeClient();
  }
  VERSION = 'foo';
  getConfiguration(): braintree.Configuration {
    throw new Error('Method not implemented.');
  }
  request(
    options: { method: string; endpoint: string; data: unknown; timeout?: number | undefined },
    callback: braintree.callback,
  ): void {
    throw new Error('Method not implemented.');
  }
}
