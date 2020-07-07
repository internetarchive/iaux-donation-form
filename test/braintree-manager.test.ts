/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from '@open-wc/testing';

import { BraintreeManager } from '../src/braintree-manager/braintree-manager';
import { PaymentClientsInterface } from '../src/braintree-manager/payment-clients';
import {
  BraintreeEndpointManagerInterface,
  HostingEnvironment,
} from '../src/braintree-manager/braintree-interfaces';
import { DonationRequest } from '../src/models/request-models/donation-request';
import { DonationResponse } from '../src/models/response-models/donation-response';
import { SuccessResponse } from '../src/models/response-models/success-models/success-response';

class MockPaymentClients implements PaymentClientsInterface {
  getBraintreeClient(): Promise<braintree.Client> {
    throw new Error('Method not implemented.');
  }
  getDataCollector(): Promise<braintree.DataCollector> {
    throw new Error('Method not implemented.');
  }
  getHostedFields(): Promise<braintree.HostedFields> {
    throw new Error('Method not implemented.');
  }
  getVenmo(): Promise<braintree.Venmo> {
    throw new Error('Method not implemented.');
  }
  getPayPal(): Promise<braintree.PayPalCheckout> {
    throw new Error('Method not implemented.');
  }
  getApplePay(): Promise<braintree.ApplePay> {
    throw new Error('Method not implemented.');
  }
  getGooglePayBraintreeClient(): Promise<braintree.GooglePayment> {
    throw new Error('Method not implemented.');
  }
  getGooglePaymentsClient(): Promise<google.payments.api.PaymentsClient> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPaypalLibrary(): Promise<any> {
    throw new Error('Method not implemented.');
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

    const fieldConfig: braintree.HostedFieldFieldOptions = {
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

    const braintreeManager = new BraintreeManager({
      authorizationToken: 'foo',
      paymentClients,
      endpointManager,
      hostedFieldStyle: {},
      hostedFieldConfig: fieldConfig,
      hostingEnvironment: HostingEnvironment.Development,
    });

    expect(braintreeManager).to.not.equal(undefined);
  });
});
