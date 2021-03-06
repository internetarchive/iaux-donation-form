import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { BraintreeManagerInterface } from '../../braintree-interfaces';
import { HostedFieldConfiguration } from './hosted-field-configuration';
import { HostedFieldName } from './hosted-field-container';
import { CreditCardHandlerInterface } from './credit-card-interface';

export class CreditCardHandler implements CreditCardHandlerInterface {
  instance: PromisedSingleton<braintree.HostedFields | undefined>;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    hostedFieldClient: braintree.HostedFields;
    hostedFieldConfig: HostedFieldConfiguration;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.hostedFieldClient = options.hostedFieldClient;
    this.hostedFieldConfig = options.hostedFieldConfig;

    this.instance = new PromisedSingleton<braintree.HostedFields | undefined>({
      generator: async (): Promise<braintree.HostedFields | undefined> => {
        const braintreeClient = await this.braintreeManager.instance.get();
        return this.hostedFieldClient.create({
          client: braintreeClient,
          styles: this.hostedFieldConfig.hostedFieldStyle,
          fields: this.hostedFieldConfig.hostedFieldFieldOptions,
        });
      },
    });
  }

  private braintreeManager: BraintreeManagerInterface;
  private hostedFieldClient: braintree.HostedFields;
  private hostedFieldConfig: HostedFieldConfiguration;

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
