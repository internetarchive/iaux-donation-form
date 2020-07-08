import { BraintreeManagerInterface } from '../../braintree-interfaces';
import { HostedFieldConfiguration } from './hosted-field-configuration';
import { HostedFieldName } from './hosted-field-container';

export interface CreditCardHandlerInterface {
  getInstance(): Promise<braintree.HostedFields | undefined>;
  tokenizeHostedFields(): Promise<braintree.HostedFieldsTokenizePayload | undefined>;
  markFieldErrors(fields: HostedFieldName[]): void;
  removeFieldErrors(fields: HostedFieldName[]): void;
}

export class CreditCardHandler implements CreditCardHandlerInterface {
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

  private hostedFieldsInstance?: braintree.HostedFields;

  async getInstance(): Promise<braintree.HostedFields | undefined> {
    if (this.hostedFieldsInstance) {
      console.log('hostedFieldsInstance exists, returning it', this.hostedFieldsInstance);
      return this.hostedFieldsInstance;
    }

    console.log('hostedFieldsInstance does not exist, creating');

    const braintreeClient = await this.braintreeManager.getInstance();

    return new Promise((resolve, reject) => {
      console.log('credit card hostedFieldsClient.create');
      this.hostedFieldClient.create(
        {
          client: braintreeClient,
          styles: this.hostedFieldConfig.hostedFieldStyle,
          fields: this.hostedFieldConfig.hostedFieldFieldOptions,
        },
        (
          hostedFieldsErr: braintree.BraintreeError | undefined,
          hostedFieldsInstance: braintree.HostedFields,
        ) => {
          if (hostedFieldsErr) {
            return reject(hostedFieldsErr);
          }

          this.hostedFieldsInstance = hostedFieldsInstance;
          resolve(hostedFieldsInstance);
        },
      );
    });
  }

  async tokenizeHostedFields(): Promise<braintree.HostedFieldsTokenizePayload | undefined> {
    console.debug('tokenizeHostedFields')
    const hostedFields = await this.getInstance();
    return hostedFields?.tokenize();
  }

  markFieldErrors(fields: HostedFieldName[]): void {
    this.hostedFieldConfig.hostedFieldContainer.markFieldErrors(fields);
  }

  removeFieldErrors(fields: HostedFieldName[]): void {
    this.hostedFieldConfig.hostedFieldContainer.removeFieldErrors(fields);
  }
}
