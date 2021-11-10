/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';
import { DonationFlowModalManager } from '../../../src/payment-flow-handlers/donation-flow-modal-manager';
import { MockModalManager } from '../../mocks/mock-modal-manager';
import '../../mocks/mock-modal-manager';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { mockSuccessResponse } from '../../mocks/models/mock-success-response';
import {
  PaymentProvider,
  DonationPaymentInfo,
  DonationType,
} from '@internetarchive/donation-form-data-models';
import { mockBillingInfo } from '../../mocks/models/mock-billing-info';
import { mockCustomerInfo } from '../../mocks/models/mock-customer-info';

describe('Donation Flow Modal Manager', () => {
  it('can close the modal', async () => {
    const mockModalManager = (await fixture(html`
      <mock-modal-manager></mock-modal-manager>
    `)) as MockModalManager;
    const mockBraintreeManager = new MockBraintreeManager();
    const manager = new DonationFlowModalManager({
      braintreeManager: mockBraintreeManager,
      modalManager: mockModalManager,
    });
    manager.closeModal();
    expect(mockModalManager.closeCalled).to.be.true;
  });

  it('can calculate the proper default upsell amount', async () => {
    let amount = DonationFlowModalManager.getDefaultUpsellAmount(1);
    expect(amount).to.equal(5);
    amount = DonationFlowModalManager.getDefaultUpsellAmount(10);
    expect(amount).to.equal(5);
    amount = DonationFlowModalManager.getDefaultUpsellAmount(10.01);
    expect(amount).to.equal(10);
    amount = DonationFlowModalManager.getDefaultUpsellAmount(25);
    expect(amount).to.equal(10);
    amount = DonationFlowModalManager.getDefaultUpsellAmount(25.01);
    expect(amount).to.equal(25);
    amount = DonationFlowModalManager.getDefaultUpsellAmount(100);
    expect(amount).to.equal(25);
    amount = DonationFlowModalManager.getDefaultUpsellAmount(100.01);
    expect(amount).to.equal(50);
  });

  it('can show the processing modal', async () => {
    const mockModalManager = (await fixture(html`
      <mock-modal-manager></mock-modal-manager>
    `)) as MockModalManager;
    const mockBraintreeManager = new MockBraintreeManager();
    const manager = new DonationFlowModalManager({
      braintreeManager: mockBraintreeManager,
      modalManager: mockModalManager,
    });
    manager.showProcessingModal();
    const modalOptions = mockModalManager.showModalOptions;
    expect(modalOptions?.config.headerColor).to.equal('#497fbf');
    expect(modalOptions?.config.showProcessingIndicator).to.be.true;
    expect(modalOptions?.config.processingImageMode).to.equal('processing');
    expect(modalOptions?.config.closeOnBackdropClick).to.be.false;
    expect(modalOptions?.config.showCloseButton).to.be.false;
    expect(modalOptions?.config.title?.strings[0]).to.contain('Processing...');
  });

  it('can show the error modal', async () => {
    const mockModalManager = (await fixture(html`
      <mock-modal-manager></mock-modal-manager>
    `)) as MockModalManager;
    const mockBraintreeManager = new MockBraintreeManager();
    const manager = new DonationFlowModalManager({
      braintreeManager: mockBraintreeManager,
      modalManager: mockModalManager,
    });
    manager.showErrorModal({ message: 'foo-error' });
    const modalOptions = mockModalManager.showModalOptions;
    expect(modalOptions?.config.headerColor).to.equal('#691916');
    expect(modalOptions?.config.showProcessingIndicator).to.be.false;
    expect(modalOptions?.config.closeOnBackdropClick).to.be.true;
    expect(modalOptions?.config.showCloseButton).to.be.true;
    expect(modalOptions?.config.headline?.strings[0]).to.contain(
      "There's been a problem completing your donation.",
    );
    expect(modalOptions?.config.message?.values[0]).to.equal('foo-error');
  });

  it('shows the thank you modal and calls `donationSuccessful` to take user to thank you page', async () => {
    const mockModalManager = (await fixture(html`
      <mock-modal-manager></mock-modal-manager>
    `)) as MockModalManager;
    const mockBraintreeManager = new MockBraintreeManager();
    const manager = new DonationFlowModalManager({
      braintreeManager: mockBraintreeManager,
      modalManager: mockModalManager,
    });
    manager.showThankYouModal({
      successResponse: mockSuccessResponse,
    });
    const modalOptions = mockModalManager.showModalOptions;
    expect(modalOptions?.config.headerColor).to.equal('#55A183');
    expect(modalOptions?.config.processingImageMode).to.equal('complete');
    expect(modalOptions?.config.showProcessingIndicator).to.be.true;
    expect(modalOptions?.config.closeOnBackdropClick).to.be.true;
    expect(modalOptions?.config.showCloseButton).to.be.true;
    expect(modalOptions?.config.title?.strings[0]).to.contain('Thank You!');
    const response = mockBraintreeManager.donationSuccessfulOptions?.successResponse;
    expect(response).to.deep.equal(mockSuccessResponse);
  });

  it('can start the donation submission flow', async () => {
    const mockModalManager = (await fixture(html`
      <mock-modal-manager></mock-modal-manager>
    `)) as MockModalManager;
    const mockBraintreeManager = new MockBraintreeManager();
    const manager = new DonationFlowModalManager({
      braintreeManager: mockBraintreeManager,
      modalManager: mockModalManager,
    });
    const result = await manager.startDonationSubmissionFlow({
      nonce: 'foo',
      paymentProvider: PaymentProvider.CreditCard,
      donationInfo: new DonationPaymentInfo({
        donationType: DonationType.OneTime,
        amount: 5,
        coverFees: false,
      }),
      billingInfo: mockBillingInfo,
      customerInfo: mockCustomerInfo,
    });

    expect(result).to.deep.equal({
      success: true,
      value: {
        amount: 5,
        billing: {
          countryCodeAlpha2: 'US',
          extendedAddress: 'Apt 123',
          locality: 'San Francisco',
          postalCode: '12345',
          region: 'CA',
          streetAddress: '123 Fake St',
        },
        customer: {
          email: 'foo@bar.com',
          firstName: 'Fooey',
          lastName: 'McBarrison',
        },
        customer_id: 'bar',
        donationType: 'one-time',
        paymentMethodNonce: 'foo',
        paymentProvider: 'Credit Card',
        transaction_id: 'foo',
      },
    });
  });
});
