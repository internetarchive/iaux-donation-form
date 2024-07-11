import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { Unsubscribe } from 'nanoevents';
import { HostedFieldName } from './hosted-field-container';

export interface CreditCardHandlerEvents {
  hostedFieldsRetry: (retryNumber: number) => void;
  hostedFieldsFailed: (error: unknown) => void;
}

export interface CreditCardHandlerInterface {
  instance: PromisedSingleton<braintree.HostedFields | undefined>;
  tokenizeHostedFields(): Promise<braintree.HostedFieldsTokenizePayload | undefined>;
  markFieldErrors(fields: HostedFieldName[]): void;
  removeFieldErrors(fields: HostedFieldName[]): void;
  showErrorMessage(message?: string): void;
  hideErrorMessage(): void;
  on<E extends keyof CreditCardHandlerEvents>(
    event: E,
    callback: CreditCardHandlerEvents[E],
  ): Unsubscribe;
}
