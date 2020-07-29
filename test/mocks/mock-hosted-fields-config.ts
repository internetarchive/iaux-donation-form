import { HostedFieldConfiguration } from '../../src/braintree-manager/payment-providers/credit-card/hosted-field-configuration';
import {
  HostedFieldContainerInterface,
  HostedFieldContainer,
} from '../../src/braintree-manager/payment-providers/credit-card/hosted-field-container';

const hostedFieldStyle: object = {
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

const hostedFieldFieldOptions: braintree.HostedFieldFieldOptions = {
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

const numberField = document.createElement('input');
const cvvField = document.createElement('input');
const expField = document.createElement('input');
const errorDiv = document.createElement('div');

const hostedFieldContainer: HostedFieldContainerInterface = new HostedFieldContainer({
  number: numberField,
  cvv: cvvField,
  expirationDate: expField,
  errorContainer: errorDiv,
});

export const mockHostedFieldConfig: HostedFieldConfiguration = new HostedFieldConfiguration({
  hostedFieldStyle,
  hostedFieldFieldOptions,
  hostedFieldContainer,
});
