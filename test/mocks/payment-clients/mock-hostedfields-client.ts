/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockHostedFieldsClient implements braintree.HostedFields {
  async create(options: {
    client?: braintree.Client | undefined;
    authorization?: string | undefined;
    fields: braintree.HostedFieldFieldOptions;
    styles?: any;
  }): Promise<braintree.HostedFields> {
    return new MockHostedFieldsClient();
  }

  styleOptions: any;
  VERSION = 'foo';
  on(
    event: import('braintree-web/modules/hosted-fields').HostedFieldEventType,
    handler: (event: braintree.HostedFieldsStateObject) => void,
  ): void {
    throw new Error('Method not implemented.');
  }
  async teardown(): Promise<void> {
    return;
  }

  async tokenize(options?: {
    vault?: boolean;
    cardholderName?: string;
    billingAddress?: any;
  }): Promise<braintree.HostedFieldsTokenizePayload> {
    return {
      nonce: 'foo-nonce',
      details: {
        bin: '1234',
        cardType: 'UNO',
        expirationMonth: '12',
        expirationYear: '12',
        lastTwo: '32',
        lastFour: '4342',
      },
      type: 'foo-type',
      description: 'bar-description',
    };
  }

  addClass(field: string, classname: string, callback?: braintree.callback | undefined): void {
    throw new Error('Method not implemented.');
  }

  removeClass(field: string, classname: string, callback?: braintree.callback | undefined): void {
    throw new Error('Method not implemented.');
  }

  setPlaceholder(
    field: string,
    placeholder: string,
    callback?: braintree.callback | undefined,
  ): void {
    throw new Error('Method not implemented.');
  }

  clear(field: string, callback?: braintree.callback | undefined): void {
    throw new Error('Method not implemented.');
  }

  getState(): any {
    throw new Error('Method not implemented.');
  }
}
