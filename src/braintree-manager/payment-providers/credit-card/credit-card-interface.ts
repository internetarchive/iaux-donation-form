import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { HostedFieldName } from './hosted-field-container';

export interface CreditCardHandlerInterface {
  instance: PromisedSingleton<braintree.HostedFields | undefined>;
  tokenizeHostedFields(): Promise<braintree.HostedFieldsTokenizePayload | undefined>;
  markFieldErrors(fields: HostedFieldName[]): void;
  removeFieldErrors(fields: HostedFieldName[]): void;
  showErrorMessage(message?: string): void;
  hideErrorMessage(): void;
}
