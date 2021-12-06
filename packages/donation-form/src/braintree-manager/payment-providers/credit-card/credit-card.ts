import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { BraintreeManagerInterface } from '../../braintree-interfaces';
import { HostedFieldConfiguration } from './hosted-field-configuration';
import { HostedFieldName } from './hosted-field-container';
import { CreditCardHandlerInterface } from './credit-card-interface';

export class CreditCardHandler implements CreditCardHandlerInterface {
  instance = new PromisedSingleton<braintree.HostedFields | undefined>({
    generator: async (): Promise<braintree.HostedFields | undefined> => {
      const braintreeClient = await this.braintreeManager.instance.get();
      const hostedFields = await this.createHostedFields(braintreeClient);
      return hostedFields;
    },
  });

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    hostedFieldClient: braintree.HostedFields;
    hostedFieldConfig: HostedFieldConfiguration;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.hostedFieldClient = options.hostedFieldClient;
    this.hostedFieldConfig = options.hostedFieldConfig;
  }

  private braintreeManager: BraintreeManagerInterface;
  private hostedFieldClient: braintree.HostedFields;
  private hostedFieldConfig: HostedFieldConfiguration;

  private maxRetryCount = 2;
  private async createHostedFields(
    braintreeClient: braintree.Client,
    retryCount = 0
  ): Promise<braintree.HostedFields | undefined> {
    this.hostedFieldConfig.hostedFieldContainer.resetIframes();
    try {
      return this.hostedFieldClient.create({
        client: braintreeClient,
        styles: this.hostedFieldConfig.hostedFieldStyle,
        fields: this.hostedFieldConfig.hostedFieldFieldOptions,
      });
    } catch (error) {
      if (retryCount > this.maxRetryCount) throw error;
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
