import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { BraintreeManagerInterface } from '../../braintree-interfaces';
import { HostedFieldConfiguration } from './hosted-field-configuration';
import { HostedFieldName } from './hosted-field-container';
import { CreditCardHandlerInterface } from './credit-card-interface';
import { promisedSleep } from '../../../util/promisedSleep';

export class CreditCardHandler implements CreditCardHandlerInterface {
  instance = new PromisedSingleton<braintree.HostedFields | undefined>({
    generator: async (): Promise<braintree.HostedFields | undefined> => {
      const braintreeClient = await this.braintreeManager.instance.get();
      const hostedFields = await this.createHostedFields(braintreeClient);
      return hostedFields;
    },
  });

  private maxRetryCount: number;

  private retryInverval: number;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    hostedFieldClient: braintree.HostedFields;
    hostedFieldConfig: HostedFieldConfiguration;
    maxRetryCount?: number;
    retryInverval?: number;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.hostedFieldClient = options.hostedFieldClient;
    this.hostedFieldConfig = options.hostedFieldConfig;
    this.maxRetryCount = options.maxRetryCount ?? 2;
    this.retryInverval = options.retryInverval ?? 1;
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
    this.hostedFieldConfig.hostedFieldContainer.resetIframes();
    try {
      const hostedFields = await this.hostedFieldClient.create({
        client: braintreeClient,
        styles: this.hostedFieldConfig.hostedFieldStyle,
        fields: this.hostedFieldConfig.hostedFieldFieldOptions,
      });
      return hostedFields;
    } catch (error) {
      if (retryCount >= this.maxRetryCount) throw error;
      await promisedSleep(this.retryInverval * 1000); // wait before retrying
      return this.createHostedFields(braintreeClient, retryCount + 1);
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
