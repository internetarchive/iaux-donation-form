/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreditCardHandlerInterface } from '../../../../src/braintree-manager/payment-providers/credit-card/credit-card';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { HostedFieldName } from '../../../../src/braintree-manager/payment-providers/credit-card/hosted-field-container';
import { MockHostedFieldsClient } from '../../payment-clients/mock-hostedfields-client';
import { mockHostedFieldTokenizePayload } from '../../payment-clients/mock-hostedfieldtokenizepayload';

export class MockCreditCardHandler implements CreditCardHandlerInterface {
  instance: PromisedSingleton<braintree.HostedFields> = new PromisedSingleton<
    braintree.HostedFields
  >({
    generator: new Promise<braintree.HostedFields>(resolve => {
      resolve(
        new MockHostedFieldsClient({
          mockHostedFieldTokenizePayload: this.mockPayload,
        }),
      );
    }),
  });

  tokenizeHostedFields(): Promise<braintree.HostedFieldsTokenizePayload | undefined> {
    throw new Error('Method not implemented.');
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
