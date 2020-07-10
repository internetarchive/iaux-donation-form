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
    console.debug('credit card getInstance', this.identifier);
    if (this.hostedFieldsInstance) {
      console.log('hostedFieldsInstance exists, returning it', this.hostedFieldsInstance);
      return this.hostedFieldsInstance;
    }

    const originalPromise = this.hostedFieldsSetupPromise;
    if (originalPromise) {
      console.debug('getInstance originalPromise exists, chainging', this.identifier);
      this.hostedFieldsSetupPromise = new Promise(resolve => {
        console.debug('getInstance inside chained callback', this.identifier);
        originalPromise.then(handler => {
          console.debug('getInstance original promise resolved, resolving second callback', this.identifier, handler);
          resolve(handler);
        });
      });
      return this.hostedFieldsSetupPromise;
    }


    // if (this.hostedFieldsSetupPromise) {
    //   const originalCallback = this.hostedFieldsSetupPromise;
    //   console.log('hostedFieldsSetupPromise exists, returning it', this.hostedFieldsSetupPromise);
    //   this.hostedFieldsSetupPromise = new Promise(resolve => {
    //     console.debug('DOWN DEEP RESOLVE');
    //     originalCallback?.then(resolve)
    //   })
    //   return this.hostedFieldsSetupPromise;
    // }

    console.log('hostedFieldsInstance does not exist, creating', this.identifier, this.hostedFieldsSetupPromise);

    // const originalCallback = this.hostedFieldsSetupPromise;
    this.hostedFieldsSetupPromise = new Promise((resolve, reject) => {
      console.debug('inside promise', this.identifier)
      this.braintreeManager.getInstance().then(braintreeClient => {
        console.debug('INSIDE getInstance', this.identifier)
        if (this.hostedFieldsSetupPromise) {
          const originalCallback = this.hostedFieldsSetupPromise;
          console.log('hostedFieldsSetupPromise exists, returning it', this.hostedFieldsSetupPromise);
          this.hostedFieldsSetupPromise = new Promise(resolve => {
            console.debug('DOWN DEEP RESOLVE');
            originalCallback?.then(resolve)
          })
          return this.hostedFieldsSetupPromise;
        }

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
            console.log('HOSTED FIELD PROMISE RESOLVED: credit card hostedFieldsClient.create');
            resolve(hostedFieldsInstance);
          },
        );
      });
    });

    return this.hostedFieldsSetupPromise
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
