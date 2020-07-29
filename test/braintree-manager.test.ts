/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from '@open-wc/testing';

import { BraintreeManager } from '../src/braintree-manager/braintree-manager';
import { HostingEnvironment } from '../src/braintree-manager/braintree-interfaces';
import { MockPaymentClients } from './mocks/mock-payment-clients';
import { MockEndpointManager } from './mocks/mock-endpoint-manager';
import { mockHostedFieldConfig } from './mocks/mock-hosted-fields-config';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { DonationRequest } from '../src/models/request-models/donation-request';
import { DonationResponse } from '../src/models/response-models/donation-response';
import { ErrorResponse } from '../src/models/response-models/error-models/error-response';
import { PaymentProvider } from '../src/models/common/payment-provider-name';
import { DonationPaymentInfo } from '../src/models/donation-info/donation-payment-info';
import { DonationType } from '../src/models/donation-info/donation-type';
import { BillingInfo } from '../src/models/common/billing-info';
import { MockBillingInfo } from './mocks/mock-billing-info';
import { MockCustomerInfo } from './mocks/mock-customer-info';
import { callback } from 'braintree-web';
import { Configuration } from 'braintree-web/modules/client';

describe('Braintree Manager', () => {
  it('can be initialized', async () => {
    const paymentClients = new MockPaymentClients();
    const endpointManager = new MockEndpointManager();

    const braintreeManager = new BraintreeManager({
      authorizationToken: 'foo',
      paymentClients,
      endpointManager,
      hostedFieldConfig: mockHostedFieldConfig,
      hostingEnvironment: HostingEnvironment.Development,
    });

    expect(braintreeManager).to.not.equal(undefined);
  });

  it('collects device data on startup', async () => {
    const paymentClients = new MockPaymentClients();
    const endpointManager = new MockEndpointManager();

    const braintreeManager = new BraintreeManager({
      authorizationToken: 'foo',
      paymentClients,
      endpointManager,
      hostedFieldConfig: mockHostedFieldConfig,
      hostingEnvironment: HostingEnvironment.Development,
    });

    await braintreeManager.startup();

    const donationInfo = new DonationPaymentInfo({
      donationType: DonationType.OneTime,
      amount: 5,
      coverFees: false,
    });

    await braintreeManager.submitDonation({
      nonce: 'boop',
      paymentProvider: PaymentProvider.CreditCard,
      donationInfo: donationInfo,
      billingInfo: new MockBillingInfo(),
      customerInfo: new MockCustomerInfo(),
    });

    expect(endpointManager.requestSubmitted?.deviceData).to.equal('foo-mock-device-data');
  });
});
