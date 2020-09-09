/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockDeviceDataCollector implements braintree.DataCollector {
  static mockDeviceData = 'foo-mock-device-data';

  async create(options: {
    client: braintree.Client;
    kount: boolean;
    paypal: boolean;
  }): Promise<braintree.DataCollector> {
    return this;
  }

  VERSION = 'foo';

  deviceData = MockDeviceDataCollector.mockDeviceData;

  teardown(callback?: braintree.callback | undefined): void {
    throw new Error('Method not implemented.');
  }
}
