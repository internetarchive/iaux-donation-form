/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from '@open-wc/testing';

import { BraintreeManager } from '../../src/braintree-manager/braintree-manager';
import { HostingEnvironment } from '../../src/braintree-manager/braintree-interfaces';
import { MockPaymentClients } from '../mocks/mock-payment-clients';
import { MockEndpointManager } from '../mocks/mock-endpoint-manager';
import { mockHostedFieldConfig } from '../mocks/mock-hosted-fields-config';
import { PaymentProvider } from '../../src/models/common/payment-provider-name';
import { DonationPaymentInfo } from '../../src/models/donation-info/donation-payment-info';
import { DonationType } from '../../src/models/donation-info/donation-type';
import { mockBillingInfo } from '../mocks/models/mock-billing-info';
import { mockCustomerInfo } from '../mocks/models/mock-customer-info';
import { MockDeviceDataCollector } from '../mocks/payment-clients/mock-data-collector';
import { mockSuccessResponse } from '../mocks/models/mock-success-response';
import { MockDonationInfo } from '../mocks/mock-donation-info';

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

  it('collects device data on startup and submits it', async () => {
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

    await braintreeManager.submitDonation({
      nonce: 'boop',
      paymentProvider: PaymentProvider.CreditCard,
      donationInfo: new MockDonationInfo(),
      billingInfo: mockBillingInfo,
      customerInfo: mockCustomerInfo,
    });

    expect(endpointManager.requestSubmitted?.deviceData).to.equal(
      MockDeviceDataCollector.mockDeviceData,
    );
  });

  it('does not collect device data if startup not called', async () => {
    const paymentClients = new MockPaymentClients();
    const endpointManager = new MockEndpointManager();

    const braintreeManager = new BraintreeManager({
      authorizationToken: 'foo',
      paymentClients,
      endpointManager,
      hostedFieldConfig: mockHostedFieldConfig,
      hostingEnvironment: HostingEnvironment.Development,
    });

    await braintreeManager.submitDonation({
      nonce: 'boop',
      paymentProvider: PaymentProvider.CreditCard,
      donationInfo: new MockDonationInfo(),
      billingInfo: mockBillingInfo,
      customerInfo: mockCustomerInfo,
    });

    expect(endpointManager.requestSubmitted?.deviceData).to.equal(undefined);
  });

  it('can properly set referrer and logged in user and submits them to the endpoint', async () => {
    const paymentClients = new MockPaymentClients();
    const endpointManager = new MockEndpointManager();

    const braintreeManager = new BraintreeManager({
      authorizationToken: 'foo',
      paymentClients,
      endpointManager,
      hostedFieldConfig: mockHostedFieldConfig,
      hostingEnvironment: HostingEnvironment.Development,
    });

    await braintreeManager.submitDonation({
      nonce: 'boop',
      paymentProvider: PaymentProvider.CreditCard,
      donationInfo: new MockDonationInfo(),
      billingInfo: mockBillingInfo,
      customerInfo: mockCustomerInfo,
    });

    // verify they're empty
    expect(endpointManager.requestSubmitted?.customFields.referrer).to.equal(undefined);
    expect(endpointManager.requestSubmitted?.customFields.logged_in_user).to.equal(undefined);

    braintreeManager.setLoggedInUser('foo-user');
    braintreeManager.setReferrer('foo-referrer');

    await braintreeManager.submitDonation({
      nonce: 'boop',
      paymentProvider: PaymentProvider.CreditCard,
      donationInfo: new MockDonationInfo(),
      billingInfo: mockBillingInfo,
      customerInfo: mockCustomerInfo,
    });

    expect(endpointManager.requestSubmitted?.customFields.referrer).to.equal('foo-referrer');
    expect(endpointManager.requestSubmitted?.customFields.logged_in_user).to.equal('foo-user');
  });

  it('properly submits an upsell donation', async () => {
    const paymentClients = new MockPaymentClients();
    const endpointManager = new MockEndpointManager();

    const braintreeManager = new BraintreeManager({
      authorizationToken: 'foo',
      paymentClients,
      endpointManager,
      hostedFieldConfig: mockHostedFieldConfig,
      hostingEnvironment: HostingEnvironment.Development,
    });

    await braintreeManager.submitUpsellDonation({
      oneTimeDonationResponse: mockSuccessResponse,
      amount: 3.5,
    });

    const requestSubmitted = endpointManager.requestSubmitted;

    expect(requestSubmitted?.donationType).to.equal(DonationType.Upsell);
    expect(requestSubmitted?.amount).to.equal(3.5);
    expect(requestSubmitted?.customFields.fee_amount_covered).to.equal(0);
  });

  it('handles successful donation', async () => {
    const paymentClients = new MockPaymentClients();
    const endpointManager = new MockEndpointManager();

    const braintreeManager = new BraintreeManager({
      authorizationToken: 'foo',
      paymentClients,
      endpointManager,
      hostedFieldConfig: mockHostedFieldConfig,
      hostingEnvironment: HostingEnvironment.Development,
    });

    await braintreeManager.donationSuccessful({
      successResponse: mockSuccessResponse,
    });

    const successResponseSubmitted = endpointManager.successResponseSubmitted;

    expect(successResponseSubmitted?.donationType).to.equal(DonationType.OneTime);
    expect(successResponseSubmitted?.amount).to.equal(5);
  });
});
