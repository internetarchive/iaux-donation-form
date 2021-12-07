import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { BraintreeManagerInterface } from '../../braintree-interfaces';
import { HostedFieldConfiguration } from './hosted-field-configuration';
import { HostedFieldName } from './hosted-field-container';
import { CreditCardHandlerEvents, CreditCardHandlerInterface } from './credit-card-interface';
import { createNanoEvents, Unsubscribe } from 'nanoevents';

export class CreditCardHandler implements CreditCardHandlerInterface {
  on<E extends keyof CreditCardHandlerEvents>(
    event: E,
    callback: CreditCardHandlerEvents[E],
  ): Unsubscribe {
    return this.emitter.on(event, callback);
  }

  instance = new PromisedSingleton<braintree.HostedFields | undefined>({
    generator: async (): Promise<braintree.HostedFields | undefined> => {
      const braintreeClient = await this.braintreeManager.instance.get();
      const hostedFields = await this.createHostedFields(braintreeClient);
      return hostedFields;
    },
  });

  private emitter = createNanoEvents<CreditCardHandlerEvents>();

  private maxRetryCount: number;

  private loadTimeout: number;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    hostedFieldClient: braintree.HostedFields;
    hostedFieldConfig: HostedFieldConfiguration;
    maxRetryCount?: number;
    loadTimeout?: number;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.hostedFieldClient = options.hostedFieldClient;
    this.hostedFieldConfig = options.hostedFieldConfig;
    this.maxRetryCount = options.maxRetryCount ?? 2;
    this.loadTimeout = (options.loadTimeout ?? 6) * 1000;
  }

  private braintreeManager: BraintreeManagerInterface;
  private hostedFieldClient: braintree.HostedFields;
  private hostedFieldConfig: HostedFieldConfiguration;

  private async createHostedFields(
    braintreeClient: braintree.Client,
    retryCount = 0,
  ): Promise<braintree.HostedFields | undefined> {
    // we mainly want to do this for retry events, but it doesn't
    // hurt to do it on the first try
    this.hostedFieldConfig.hostedFieldContainer.resetHostedFields();
    try {
      // The hosted fields have a 60 second timeout internally, but braintree
      // support recommended setting a shorter timeout because 99% of users
      // load the hosted fields in under 4 seconds and 99.9% with 18 seconds.
      // What we're doing here is creating a "timeout" promise
      // and a "create hosted fields" promise and doing a `Promise.race()` to
      // resolve when the first one finishes. If the timeout finishes first,
      // we throw an error to trigger the retry logic. If the hosted fields
      // finishes first, we cancel the timeout promise since we're done.
      let timeout: number;
      const timeoutPromise = new Promise<void>((resolve, reject) => {
        timeout = window.setTimeout(() => {
          reject(new Error('Timeout loading Hosted Fields'));
        }, this.loadTimeout);
      });

      const hostedFieldsPromise = new Promise<braintree.HostedFields | undefined>(async resolve => {
        const fields = await this.hostedFieldClient.create({
          client: braintreeClient,
          styles: this.hostedFieldConfig.hostedFieldStyle,
          fields: this.hostedFieldConfig.hostedFieldFieldOptions,
        });
        // clear the timeout when this finishes so we don't also get the timeout rejection
        window.clearTimeout(timeout);
        resolve(fields);
      });

      const result = await Promise.race([timeoutPromise, hostedFieldsPromise]);

      return result as braintree.HostedFields;
    } catch (error) {
      if (retryCount >= this.maxRetryCount) {
        this.emitter.emit('hostedFieldsFailed', error);
        throw error;
      }
      const newRetryCount = retryCount + 1;
      this.emitter.emit('hostedFieldsRetry', newRetryCount);
      return this.createHostedFields(braintreeClient, newRetryCount);
    }
  }

  async tokenizeHostedFields(): Promise<braintree.HostedFieldsTokenizePayload | undefined> {
    const hostedFields = await this.instance.get();
    return hostedFields?.tokenize();
  }

  markFieldErrors(fields: HostedFieldName[]): void {
    this.hostedFieldConfig.hostedFieldContainer.markFieldErrors(fields);
  }

  removeFieldErrors(fields: HostedFieldName[]): void {
    this.hostedFieldConfig.hostedFieldContainer.removeFieldErrors(fields);
  }

  showErrorMessage(message?: string): void {
    this.hostedFieldConfig.hostedFieldContainer.showErrorMessage(message);
  }

  hideErrorMessage(): void {
    this.hostedFieldConfig.hostedFieldContainer.hideErrorMessage();
  }
}
