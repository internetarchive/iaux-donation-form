/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from '@open-wc/testing';

import { PromisedSingleton } from '@internetarchive/promised-singleton';

import { BraintreeManager } from '../src/braintree-manager/braintree-manager';
import { PaymentClientsInterface } from '../src/braintree-manager/payment-clients';
import {
  BraintreeEndpointManagerInterface,
  HostingEnvironment,
} from '../src/braintree-manager/braintree-interfaces';
import { DonationRequest } from '../src/models/request-models/donation-request';
import { DonationResponse } from '../src/models/response-models/donation-response';
import { SuccessResponse } from '../src/models/response-models/success-models/success-response';
import { HostedFieldConfiguration } from '../src/braintree-manager/payment-providers/credit-card/hosted-field-configuration';
import {
  HostedFieldContainerInterface,
  HostedFieldContainer,
} from '../src/braintree-manager/payment-providers/credit-card/hosted-field-container';
import {
  Client,
  DataCollector,
  HostedFields,
  Venmo,
  PayPalCheckout,
  ApplePay,
  GooglePayment,
} from 'braintree-web';

class MockPaymentClients implements PaymentClientsInterface {
  braintreeClient: PromisedSingleton<Client>;
  dataCollector: PromisedSingleton<DataCollector>;
  hostedFields: PromisedSingleton<HostedFields>;
  venmo: PromisedSingleton<Venmo>;
  payPal: PromisedSingleton<PayPalCheckout>;
  applePay: PromisedSingleton<ApplePay>;
  googlePayBraintreeClient: PromisedSingleton<GooglePayment>;
  googlePaymentsClient: PromisedSingleton<google.payments.api.PaymentsClient>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paypalLibrary: PromisedSingleton<any>;

  constructor() {
    this.braintreeClient = new PromisedSingleton<Client>({
      generator: new Promise((resolve, reject) => {
        reject('Not implemented');
      }),
    });
    this.dataCollector = new PromisedSingleton<DataCollector>({
      generator: new Promise((resolve, reject) => {
        reject('Not implemented');
      }),
    });
    this.hostedFields = new PromisedSingleton<HostedFields>({
      generator: new Promise((resolve, reject) => {
        reject('Not implemented');
      }),
    });
    this.venmo = new PromisedSingleton<Venmo>({
      generator: new Promise((resolve, reject) => {
        reject('Not implemented');
      }),
    });
    this.payPal = new PromisedSingleton<PayPalCheckout>({
      generator: new Promise((resolve, reject) => {
        reject('Not implemented');
      }),
    });
    this.applePay = new PromisedSingleton<ApplePay>({
      generator: new Promise((resolve, reject) => {
        reject('Not implemented');
      }),
    });
    this.googlePayBraintreeClient = new PromisedSingleton<GooglePayment>({
      generator: new Promise((resolve, reject) => {
        reject('Not implemented');
      }),
    });
    this.googlePaymentsClient = new PromisedSingleton<google.payments.api.PaymentsClient>({
      generator: new Promise((resolve, reject) => {
        reject('Not implemented');
      }),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.paypalLibrary = new PromisedSingleton<any>({
      generator: new Promise((resolve, reject) => {
        reject('Not implemented');
      }),
    });
  }
}

class MockEndpointManager implements BraintreeEndpointManagerInterface {
  submitData(request: DonationRequest): Promise<DonationResponse> {
    throw new Error('Method not implemented.');
  }
  donationSuccessful(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse | undefined;
  }): void {
    throw new Error('Method not implemented.');
  }
}

describe('Braintree Manager', () => {
  it('can be initialized', async () => {
    const paymentClients = new MockPaymentClients();
    const endpointManager = new MockEndpointManager();

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

    const config: HostedFieldConfiguration = new HostedFieldConfiguration({
      hostedFieldStyle,
      hostedFieldFieldOptions,
      hostedFieldContainer,
    });

    const braintreeManager = new BraintreeManager({
      authorizationToken: 'foo',
      paymentClients,
      endpointManager,
      hostedFieldConfig: config,
      hostingEnvironment: HostingEnvironment.Development,
    });

    expect(braintreeManager).to.not.equal(undefined);
  });
});
