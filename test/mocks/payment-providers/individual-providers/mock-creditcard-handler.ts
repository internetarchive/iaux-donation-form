import { CreditCardHandlerInterface } from '../../../../src/braintree-manager/payment-providers/credit-card/credit-card';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { HostedFieldName } from '../../../../src/braintree-manager/payment-providers/credit-card/hosted-field-container';
import { MockHostedFieldsClient } from '../../payment-clients/mock-hostedfields-client';

export class MockCreditCardHandler implements CreditCardHandlerInterface {
  instance: PromisedSingleton<braintree.HostedFields> = new PromisedSingleton<
    braintree.HostedFields
  >({
    generator: new Promise<braintree.HostedFields>(resolve => {
      resolve(new MockHostedFieldsClient());
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
}
