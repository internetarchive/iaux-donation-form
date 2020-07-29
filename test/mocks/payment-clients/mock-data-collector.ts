export class MockDeviceDataCollector implements braintree.DataCollector {
  async create(options: {
    client: braintree.Client;
    kount: boolean;
    paypal: boolean;
  }): Promise<braintree.DataCollector> {
    return new MockDeviceDataCollector();
  }

  VERSION = 'foo';
  deviceData = 'foo-mock-device-data';
  teardown(callback?: braintree.callback | undefined): void {
    throw new Error('Method not implemented.');
  }
}
