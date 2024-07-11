import { HostedFieldConfiguration } from '../../src/braintree-manager/payment-providers/credit-card/hosted-field-configuration';
import { MockHostedFieldContainer } from './mock-hosted-fields-container';

export const mockHostedFieldStyle: Record<string, Record<string, string>> = {
  input: {
    'font-size': '16px',
    'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
    'font-weight': '700',
    color: '#333',
  },
  ':focus': {
    color: '#333',
  },
  '.valid': {},
  '.invalid': {
    color: '#b00b00',
  },
};

export const mockHostedFieldFieldOptions: braintree.HostedFieldFieldOptions = {
  number: {
    selector: '#braintree-creditcard',
    placeholder: 'Card number',
  },
  cvv: {
    selector: '#braintree-cvv',
    placeholder: 'CVC',
  },
  expirationDate: {
    selector: '#braintree-expiration',
    placeholder: 'MM / YY',
  },
};

const mockHostedFieldContainer = new MockHostedFieldContainer();

export const mockHostedFieldConfig: HostedFieldConfiguration = new HostedFieldConfiguration({
  hostedFieldStyle: mockHostedFieldStyle,
  hostedFieldFieldOptions: mockHostedFieldFieldOptions,
  hostedFieldContainer: mockHostedFieldContainer,
});
