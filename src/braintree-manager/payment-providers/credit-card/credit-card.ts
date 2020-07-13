import { BraintreeManagerInterface } from '../../braintree-interfaces';
import { HostedFieldConfiguration } from './hosted-field-configuration';
import { HostedFieldName } from './hosted-field-container';

export interface CreditCardHandlerInterface {
  getInstance(): Promise<braintree.HostedFields | undefined>;
  tokenizeHostedFields(): Promise<braintree.HostedFieldsTokenizePayload | undefined>;
  markFieldErrors(fields: HostedFieldName[]): void;
  removeFieldErrors(fields: HostedFieldName[]): void;
  identifier: number;
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
    this.identifier = Math.random() * 1000;
  }

  private braintreeManager: BraintreeManagerInterface;
  private hostedFieldClient: braintree.HostedFields;
  private hostedFieldConfig: HostedFieldConfiguration;
  identifier: number;

  private hostedFieldsInstance?: braintree.HostedFields;
  private hostedFieldsSetupPromise?: Promise<braintree.HostedFields | undefined>;

  async getInstance(): Promise<braintree.HostedFields | undefined> {
    if (this.hostedFieldsInstance) {
      return this.hostedFieldsInstance;
    }

    // we only want one instance of this to be created so this chains the promise
    // calls if multiple callers request the instance
    // const originalPromise = this.clientInstancePromise;
    if (this.hostedFieldsSetupPromise) {
      this.hostedFieldsSetupPromise = this.hostedFieldsSetupPromise.then(handler => {
        return handler;
      });
      return this.hostedFieldsSetupPromise;
    }

    this.hostedFieldsSetupPromise = this.braintreeManager
      .getInstance()
      .then(braintreeClient => {
        return this.hostedFieldClient.create({
          client: braintreeClient,
          styles: this.hostedFieldConfig.hostedFieldStyle,
          fields: this.hostedFieldConfig.hostedFieldFieldOptions,
        });
      })
      .then(instance => {
        this.hostedFieldsInstance = instance;
        return instance;
      });

    return this.hostedFieldsSetupPromise;
  }

  async tokenizeHostedFields(): Promise<braintree.HostedFieldsTokenizePayload | undefined> {
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
