/* eslint-disable @typescript-eslint/no-unused-vars */
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { HostedFieldName } from '../../../../src/braintree-manager/payment-providers/credit-card/hosted-field-container';
import { MockHostedFieldsClient } from '../../payment-clients/mock-hostedfields-client';
import { mockHostedFieldTokenizePayload } from '../../payment-clients/mock-hostedfieldtokenizepayload';
import { CreditCardHandlerInterface } from '../../../../src/braintree-manager/payment-providers/credit-card/credit-card-interface';

export class MockCreditCardHandler implements CreditCardHandlerInterface {
  instance = new PromisedSingleton<braintree.HostedFields>({
    generator: (): Promise<braintree.HostedFields> =>
      new Promise<braintree.HostedFields>(resolve => {
        const client = new MockHostedFieldsClient({
          mockHostedFieldTokenizePayload: this.mockPayload,
        });
        resolve(client);
      }),
  });

  shutdown(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async tokenizeHostedFields(): Promise<braintree.HostedFieldsTokenizePayload | undefined> {
    return this.mockPayload;
  }

  markFieldErrors(fields: HostedFieldName[]): void {
    throw new Error('Method not implemented.');
  }

  removeFieldErrors(fields: HostedFieldName[]): void {
    throw new Error('Method not implemented.');
  }

  showErrorMessage(message?: string | undefined): void {
    throw new Error('Method not implemented.');
  }

  hideErrorMessage(): void {
    throw new Error('Method not implemented.');
  }

  constructor(options?: { mockPayload: braintree.HostedFieldsTokenizePayload }) {
    this.mockPayload = options?.mockPayload ?? mockHostedFieldTokenizePayload;
  }

  mockPayload: braintree.HostedFieldsTokenizePayload;
}
