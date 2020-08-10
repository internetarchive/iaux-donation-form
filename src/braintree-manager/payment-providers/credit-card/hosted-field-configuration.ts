import { HostedFieldContainerInterface } from './hosted-field-container';

export class HostedFieldConfiguration {
  hostedFieldStyle: object;

  hostedFieldFieldOptions: braintree.HostedFieldFieldOptions;

  hostedFieldContainer: HostedFieldContainerInterface;

  constructor(options: {
    hostedFieldStyle: object;
    hostedFieldFieldOptions: braintree.HostedFieldFieldOptions;
    hostedFieldContainer: HostedFieldContainerInterface;
  }) {
    this.hostedFieldFieldOptions = options.hostedFieldFieldOptions;
    this.hostedFieldStyle = options.hostedFieldStyle;
    this.hostedFieldContainer = options.hostedFieldContainer;
  }
}
